import { NextResponse } from "next/server";
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

    // Read JSON body from request
    const body = await req.json();
    const { title, content, pageType } = body;

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    // Assign default values if missing
    const textTitle = title || "Untitled";
    const textPageType = pageType || "general";

    // Add text to Firestore
    const newTextRef = await db.collection("textUploads").add({
      title: textTitle,
      content,
      pageType: textPageType,
      createdAt: new Date(),
    });

    return NextResponse.json({
      message: "Text uploaded successfully",
      id: newTextRef.id,
      title: textTitle,
      content,
      pageType: textPageType,
    });
  } catch (error) {
    console.error("Text upload failed:", error);
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}
