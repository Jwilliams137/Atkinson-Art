import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

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

const singleImageSections = ["artwork", "about", "biography", "podcasts", "exhibitions"];

export async function POST(req) {
  try {
    const formData = await req.formData();
    const docId = formData.get("docId");
    const imageDataRaw = formData.get("imageData");
    const color = formData.get("color");
    const pageType = formData.get("pageType");

    if (!docId || !imageDataRaw || !pageType) {
      return NextResponse.json({ error: "Missing docId, pageType, or imageData" }, { status: 400 });
    }

    const isSingleImageOnly = singleImageSections.includes(pageType);
    const imageData = JSON.parse(imageDataRaw);
    const docRef = db.collection("uploads").doc(docId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const doc = docSnap.data();
    const existingImages = Array.isArray(doc.imageUrls) && doc.imageUrls.length
      ? doc.imageUrls
      : doc.imageUrl
        ? [{
            url: doc.imageUrl,
            cloudinaryId: doc.cloudinaryId || null,
            width: doc.width || null,
            height: doc.height || null,
            detailOrder: 0,
          }]
        : [];

    const tempImages = {};

    for (let i = 0; i < imageData.length; i++) {
      const { fileKey, oldCloudinaryId, detailOrder, delete: shouldDelete } = imageData[i];
      const file = formData.get(fileKey);

      if (shouldDelete && oldCloudinaryId) {
        await cloudinary.v2.uploader.destroy(oldCloudinaryId);
        tempImages[detailOrder] = {
          url: null,
          cloudinaryId: null,
          width: null,
          height: null,
        };
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

        tempImages[detailOrder] = {
          url: uploadResponse.secure_url,
          cloudinaryId: uploadResponse.public_id,
          width: uploadResponse.width,
          height: uploadResponse.height,
        };
      } else {
        let existing =
          existingImages.find((img) => img?.cloudinaryId === oldCloudinaryId) ??
          existingImages[detailOrder] ??
          (existingImages.length === 1 && detailOrder === 0 ? existingImages[0] : null);

        if (existing?.url) {
          tempImages[detailOrder] = existing;
        }
      }
    }

    let finalImages = imageData
      .sort((a, b) => a.detailOrder - b.detailOrder)
      .map((entry, i) => {
        const fallback = isSingleImageOnly
          ? existingImages[0] || {
              url: null,
              cloudinaryId: null,
              width: null,
              height: null,
            }
          : {
              url: null,
              cloudinaryId: null,
              width: null,
              height: null,
            };

        return {
          ...(tempImages[entry.detailOrder] || fallback),
          detailOrder: i,
        };
      });

    // Trim or pad to match section limit
    if (!isSingleImageOnly) {
      while (finalImages.length < 4) {
        finalImages.push({
          url: null,
          cloudinaryId: null,
          width: null,
          height: null,
          detailOrder: finalImages.length,
        });
      }
    } else {
      finalImages = finalImages.slice(0, 1);
    }

    const updatePayload = {
      imageUrls: finalImages,
    };

    const hasRealImage = finalImages.some(img => img?.url);
    if (hasRealImage) {
      updatePayload.imageUrl = FieldValue.delete();
      updatePayload.cloudinaryId = FieldValue.delete();
      updatePayload.width = FieldValue.delete();
      updatePayload.height = FieldValue.delete();
    }

    ["price", "description", "dimensions"].forEach((field) => {
      const value = formData.get(field);
      if (value !== null) {
        updatePayload[field] = value;
      }
    });

    if (color && pageType === "artwork") {
      updatePayload.color = color;
    }

    await docRef.update(updatePayload);

    return NextResponse.json({
      message: "Images updated successfully",
      imageUrls: finalImages,
    });
  } catch (error) {
    console.error("Error editing images:", error);
    return NextResponse.json({ error: "Failed to edit images" }, { status: 500 });
  }
}