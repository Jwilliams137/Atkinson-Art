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
    let index = 0;
    while (formData.has(`file${index}`)) {
      const file = formData.get(`file${index}`);
      const width = parseInt(formData.get(`width${index}`), 10) || null;
      const height = parseInt(formData.get(`height${index}`), 10) || null;
      const parsed = parseInt(formData.get(`detailOrder${index}`), 10);
      const detailOrder = isNaN(parsed) ? index : parsed;

      if (file instanceof File) {
        imageFiles.push({ file, width, height, detailOrder });
      }

      index++;
    }

    if (imageFiles.length === 0) {
      return NextResponse.json({ error: "No image files found" }, { status: 400 });
    }

    const title = formData.get("title");
    const description = formData.get("description");
    const dimensions = formData.get("dimensions");
    const price = formData.get("price");
    const pageType = formData.get("pageType");
    const type = formData.get("type");
    const color = formData.get("color");
    const includeColor = formData.has("color"); // ← key change here

    const imageUrls = [];

    for (const { file, width, height, detailOrder } of imageFiles) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

      const uploadResponse = await cloudinary.v2.uploader.upload(base64Image, {
        folder: "uploads",
      });

      imageUrls.push({
        url: uploadResponse.secure_url,
        cloudinaryId: uploadResponse.public_id,
        width,
        height,
        detailOrder,
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
      type: type || "general",
      createdAt: new Date(),
      order: newOrder,
      imageUrls,
      ...(includeColor && color?.trim() ? { color } : {}),
    };

    await db.collection("uploads").add(uploadData);

    return NextResponse.json({
      message: "Multi-image upload successful",
      imageUrls,
      order: newOrder,
    });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}