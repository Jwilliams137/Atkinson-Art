import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Ensure Firebase is initialized only once
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

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// **DELETE Request for Deleting Images**
export async function DELETE(req) {
  try {
    const { cloudinaryId, imageId } = await req.json();

    if (!cloudinaryId || !imageId) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    console.log(`Deleting image from Cloudinary with ID: ${cloudinaryId}`);
    console.log(`Deleting image from Firestore with ID: ${imageId}`);

    // Delete from Cloudinary
    const cloudinaryResponse = await cloudinary.v2.uploader.destroy(cloudinaryId);
    if (cloudinaryResponse.result !== "ok") {
      return NextResponse.json({ error: "Failed to delete image from Cloudinary" }, { status: 500 });
    }

    // Delete from Firestore
    await db.collection("uploads").doc(imageId).delete();

    return NextResponse.json({ message: "Image deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error during image deletion:", error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
