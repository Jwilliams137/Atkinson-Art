import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await getAuth().verifyIdToken(token);
    const userEmail = decodedToken.email;
    const allowedAdmins = [
      process.env.ADMIN_EMAIL_1,
      process.env.ADMIN_EMAIL_2,
      process.env.ADMIN_EMAIL_3,
    ];

    if (!allowedAdmins.includes(userEmail)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await req.formData();

    const imageFiles = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("file") && value instanceof File) {
        imageFiles.push(value);
      }
    }

    if (imageFiles.length === 0) {
      return NextResponse.json({ error: "No image files found" }, { status: 400 });
    }

    const title = formData.get("title");
    const description = formData.get("description");
    const dimensions = formData.get("dimensions");
    const price = formData.get("price");
    const width = formData.get("width");
    const height = formData.get("height");
    const pageType = formData.get("pageType");
    const type = formData.get("type");
    const color = formData.get("color");
    const imageUrls = [];

    for (const file of imageFiles) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

      const uploadResponse = await cloudinary.v2.uploader.upload(base64Image, {
        folder: "uploads",
      });

      imageUrls.push({
        url: uploadResponse.secure_url,
        cloudinaryId: uploadResponse.public_id,
      });
    }

    const uploadsRef = db.collection("uploads").where("pageType", "==", pageType);
    const snapshot = await uploadsRef.orderBy("order", "desc").limit(1).get();
    const maxOrder = !snapshot.empty ? snapshot.docs[0].data().order : 0;
    const newOrder = maxOrder + 1;

    const uploadData = {
      pageType: pageType || "home",
      title: title || "No Title",
      description: description || "",
      dimensions: dimensions || "",
      price: price || "",
      width: width ? parseInt(width) : null,
      height: height ? parseInt(height) : null,
      color: color || "default",
      type: type || "general",
      createdAt: new Date(),
      order: newOrder,
      imageUrls,
    };

    await db.collection("uploads").add(uploadData);

    return NextResponse.json({
      message: "Multi-image upload successful",
      imageUrls,
      order: newOrder,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Upload failed:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}