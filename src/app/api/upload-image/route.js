import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
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

export async function POST(req) {
  try {
    // Authorization check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await getAuth().verifyIdToken(token);
    const userEmail = decodedToken.email;
    const allowedAdmins = [process.env.ADMIN_EMAIL_1, process.env.ADMIN_EMAIL_2];

    if (!allowedAdmins.includes(userEmail)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Handling form data
    const formData = await req.formData();
    const file = formData.get("file");
    const title = formData.get("title");
    const width = formData.get("width");
    const height = formData.get("height");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Process file upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;
    const uploadResponse = await cloudinary.v2.uploader.upload(base64Image, {
      folder: "uploads",
    });

    // Save metadata to Firestore
    await db.collection("artworks").add({
      title: title || "Untitled",
      imageUrl: uploadResponse.secure_url,
      width: width ? parseInt(width) : null,
      height: height ? parseInt(height) : null,
      createdAt: new Date(),
    });

    return NextResponse.json({
      message: "Upload successful",
      url: uploadResponse.secure_url,
      width: width ? parseInt(width) : null,
      height: height ? parseInt(height) : null,
    });

  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
