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
        const docRef = db.collection("uploads").doc(docId);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return NextResponse.json({ error: "Document not found" }, { status: 404 });
        }

        const existingImages = docSnap.data().imageUrls || [];
        const resultImages = [];

        for (let i = 0; i < imageData.length; i++) {
            const { fileKey, oldCloudinaryId, delete: shouldDelete } = imageData[i];
            const file = formData.get(fileKey);

            if (shouldDelete && oldCloudinaryId) {
                await cloudinary.v2.uploader.destroy(oldCloudinaryId);
                resultImages.push({
                    url: null,
                    cloudinaryId: null,
                    width: null,
                    height: null,
                    detailOrder: i,
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

                resultImages.push({
                    url: uploadResponse.secure_url,
                    cloudinaryId: uploadResponse.public_id,
                    width: uploadResponse.width,
                    height: uploadResponse.height,
                    detailOrder: i,
                });
            } else {
                const existing = existingImages.find(
                    (img) => img?.cloudinaryId === oldCloudinaryId
                ) || {
                    url: null,
                    cloudinaryId: null,
                    width: null,
                    height: null,
                };

                resultImages.push({
                    ...existing,
                    detailOrder: i,
                });
            }
        }

        const desiredSlotCount = 4;
        for (let i = 0; i < desiredSlotCount; i++) {
            if (!resultImages[i]) {
                resultImages[i] = {
                    url: null,
                    cloudinaryId: null,
                    width: null,
                    height: null,
                    detailOrder: i,
                };
            } else {
                resultImages[i].detailOrder = i;
            }
        }

        await docRef.update({ imageUrls: resultImages });

        return NextResponse.json({
            message: "Images updated successfully",
            imageUrls: resultImages,
        });
    } catch (error) {
        console.error("Error editing images:", error);
        return NextResponse.json({ error: "Failed to edit images" }, { status: 500 });
    }
}