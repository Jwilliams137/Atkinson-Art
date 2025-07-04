import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

if (!getApps().length) {
    initializeApp({
        credential: cert({
            projectId: process.env.NEXT_PUBLIC_PROJECTID,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
    });
}

const db = getFirestore();

cloudinary.v2.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
    try {
        const formData = await req.formData();
        const docId = formData.get("docId");
        const imageDataRaw = formData.get("imageData");

        if (!docId || !imageDataRaw) {
            return NextResponse.json({ error: "Missing docId or imageData" }, { status: 400 });
        }

        const imageData = JSON.parse(imageDataRaw);
        const updatedImagesMap = new Map();

        for (const { fileKey, oldCloudinaryId, detailOrder, delete: shouldDelete } of imageData) {
            const file = formData.get(fileKey);

            if (shouldDelete && oldCloudinaryId) {
                await cloudinary.v2.uploader.destroy(oldCloudinaryId);
                updatedImagesMap.set(detailOrder, {
                    url: null,
                    cloudinaryId: null,
                    width: null,
                    height: null,
                    detailOrder,
                });
                continue;
            }

            if (file instanceof File && file.size > 0) {
                if (oldCloudinaryId) {
                    await cloudinary.v2.uploader.destroy(oldCloudinaryId);
                }

                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

                const uploadResponse = await cloudinary.v2.uploader.upload(base64Image, {
                    folder: "uploads",
                });

                updatedImagesMap.set(detailOrder, {
                    url: uploadResponse.secure_url,
                    cloudinaryId: uploadResponse.public_id,
                    width: uploadResponse.width,
                    height: uploadResponse.height,
                    detailOrder,
                });
            }
        }

        const docRef = db.collection("uploads").doc(docId);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return NextResponse.json({ error: "Document not found" }, { status: 404 });
        }

        const existingData = docSnap.data();
        const currentImages = [...(existingData.imageUrls || [])];

        for (const [detailOrder, update] of updatedImagesMap.entries()) {
            currentImages[detailOrder] = {
                ...currentImages[detailOrder],
                ...update
            };
        }

        const reordered = currentImages
            .filter(img => img !== undefined)
            .sort((a, b) => a.detailOrder - b.detailOrder)
            .map((img, index) => ({ ...img, detailOrder: index }));

        await docRef.update({ imageUrls: reordered });

        return NextResponse.json({
            message: "Images updated successfully",
            imageUrls: reordered,
        });
    } catch (error) {
        console.error("Error editing images:", error);
        return NextResponse.json({ error: "Failed to edit images" }, { status: 500 });
    }
}