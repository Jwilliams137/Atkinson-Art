import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase if not already initialized
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

export async function DELETE(req) {
  try {
    const { cloudinaryId, imageId } = await req.json();

    if (!cloudinaryId || !imageId) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // Log the IDs to ensure they are passed correctly
    console.log(`Deleting image from Cloudinary with ID: ${cloudinaryId}`);
    console.log(`Deleting image from Firestore with ID: ${imageId}`);

    // Delete image from Cloudinary
    const cloudinaryResponse = await cloudinary.v2.uploader.destroy(cloudinaryId);

    // Check Cloudinary response
    if (cloudinaryResponse.result !== "ok") {
      console.log("Cloudinary response:", cloudinaryResponse);
      return NextResponse.json({ error: "Failed to delete image from Cloudinary" }, { status: 500 });
    }

    // Log Cloudinary success
    console.log("Successfully deleted image from Cloudinary");

    // Delete image document from Firestore
    const firestoreResponse = await db.collection("uploads").doc(imageId).delete();
    
    // Log Firestore response (just in case)
    console.log(firestoreResponse);

    return NextResponse.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error during image deletion:", error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
