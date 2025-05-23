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

export async function DELETE(req) {
  try {
    const { cloudinaryIds, imageId } = await req.json();

    if (!Array.isArray(cloudinaryIds) || !imageId) {
      return NextResponse.json({ error: "Missing or invalid data" }, { status: 400 });
    }

    for (const id of cloudinaryIds) {
      const result = await cloudinary.v2.uploader.destroy(id);
      if (result.result !== "ok" && result.result !== "not found") {
        return NextResponse.json({ error: `Failed to delete Cloudinary image: ${id}` }, { status: 500 });
      }
    }

    await db.collection("uploads").doc(imageId).delete();

    return NextResponse.json({ message: "Image deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error during image deletion:", error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}