import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

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
      const authHeader = req.headers.get("Authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const token = authHeader.split("Bearer ")[1];
      const decodedToken = await getAuth().verifyIdToken(token);
      const userEmail = decodedToken.email;
  
      const formData = await req.formData();
      const file = formData.get("file");
      const metadata = formData.get("metadata"); // Get metadata JSON from the request
  
      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }
  
      let metadataObj = {};
      if (metadata) {
        try {
          metadataObj = JSON.parse(metadata);
        } catch (error) {
          return NextResponse.json({ error: "Invalid metadata format" }, { status: 400 });
        }
      }
  
      const resumeType = metadataObj.type || "resume";
  
      // Convert file to base64 for Cloudinary upload
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64File = `data:${file.type};base64,${buffer.toString("base64")}`;
  
      // Upload to Cloudinary
      const uploadResponse = await cloudinary.v2.uploader.upload(base64File, {
        folder: "resumes",
        resource_type: "auto",
      });
  
      if (!uploadResponse || !uploadResponse.secure_url) {
        return NextResponse.json({ error: "Cloudinary upload failed" }, { status: 500 });
      }
  
      console.log("Cloudinary upload successful:", uploadResponse.secure_url);
  
      const resumeRef = await db.collection("resumes").add({
        fileName: file.name || "Unknown",
        fileType: file.type,
        resumeUrl: uploadResponse.secure_url,
        cloudinaryId: uploadResponse.public_id,
        type: resumeType,
        uploadedAt: new Date(),
      });
  
      console.log("Resume saved to Firestore:", resumeRef.id);
  
      return NextResponse.json({
        message: "Resume uploaded and saved successfully",
        url: uploadResponse.secure_url,
        cloudinaryId: uploadResponse.public_id,
        docId: resumeRef.id,
      });
    } catch (error) {
      console.error("Upload failed:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  
