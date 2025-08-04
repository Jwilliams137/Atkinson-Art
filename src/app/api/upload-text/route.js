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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await getAuth().verifyIdToken(token);
    const userEmail = decodedToken.email;
    const allowedAdmins = [process.env.ADMIN_EMAIL_1, process.env.ADMIN_EMAIL_2, process.env.ADMIN_EMAIL_3];

    if (!allowedAdmins.includes(userEmail)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { content, pageType, type, order, snippetOrder, year, link, buttonText } = body;

    const textPageType = pageType || "general";
    const textType = type || "untitled";
    const cleanOrder = textPageType === "exhibitions" ? null : order;

    const data = {
      pageType: textPageType,
      type: textType,
      createdAt: new Date(),
      ...(content ? { content } : {}),
      ...(textPageType === "exhibitions"
        ? snippetOrder !== null && snippetOrder !== undefined
          ? { snippetOrder }
          : {}
        : cleanOrder !== null && cleanOrder !== undefined
          ? { order: cleanOrder }
          : {}),
      ...(year ? { year } : {}),
      ...(link ? { link } : {}),
      ...(buttonText ? { buttonText } : {})
    };

    const newTextRef = await db.collection("textUploads").add(data);

    return NextResponse.json({
      message: "Text uploaded successfully",
      id: newTextRef.id,
      content,
      pageType: textPageType,
      type: textType,
    });
  } catch (error) {
    console.error("Text upload failed:", error);
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}