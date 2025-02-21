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
    const pageType = formData.get("pageType");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Get the current max order for the given pageType
    let maxOrder = 0;
    const uploadsRef = db.collection("uploads").where("pageType", "==", pageType);
    const snapshot = await uploadsRef.orderBy("order", "desc").limit(1).get();

    if (!snapshot.empty) {
      maxOrder = snapshot.docs[0].data().order;
    }

    // Increment order by 1
    const newOrder = maxOrder + 1;

    // Process file upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;
    const uploadResponse = await cloudinary.v2.uploader.upload(base64Image, {
      folder: "uploads",
    });

    // Create a unique document for each upload
    await db.collection("uploads").add({
      pageType: pageType || "home", // Set the pageType (default "home")
      title: title || "No Title",
      imageUrl: uploadResponse.secure_url,
      cloudinaryId: uploadResponse.public_id, // Include the Cloudinary ID
      createdAt: new Date(),
      width: width ? parseInt(width) : null,
      height: height ? parseInt(height) : null,
      order: newOrder, // Add order to the document
    });

    return NextResponse.json({
      message: "Upload successful",
      url: uploadResponse.secure_url,
      cloudinaryId: uploadResponse.public_id, // Return Cloudinary ID in response
      width: width ? parseInt(width) : null,
      height: height ? parseInt(height) : null,
      order: newOrder, // Include the order number in the response
    });

  } catch (error) {
    // Handle error more gracefully and log only if it's an actual object
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Upload failed:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
