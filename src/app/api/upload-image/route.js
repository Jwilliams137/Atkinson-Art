import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "../../../../utils/firebase"; // Adjust path as needed

const db = getFirestore(app);

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const title = formData.get("title");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

    const uploadResponse = await cloudinary.v2.uploader.upload(base64Image, {
      folder: "uploads",
    });

    console.log("Uploaded to Cloudinary:", uploadResponse.secure_url);

    // Save image info to Firestore
    const docRef = await addDoc(collection(db, "artworks"), {
      title: title || "Untitled",
      imageUrl: uploadResponse.secure_url,
      createdAt: new Date(),
    });

    console.log("Saved to Firestore:", docRef.id);

    return NextResponse.json({
      message: "Upload successful",
      url: uploadResponse.secure_url,
    });
  } catch (error) {
    console.error("Upload error:", error.message);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
