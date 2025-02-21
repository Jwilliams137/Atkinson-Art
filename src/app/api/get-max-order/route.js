import { NextResponse } from "next/server";
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_PROJECTID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

const db = admin.firestore();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const pageType = searchParams.get("pageType");

    if (!pageType) {
      return NextResponse.json({ error: "PageType is required" }, { status: 400 });
    }

    const uploadsRef = db.collection("uploads").where("pageType", "==", pageType);
    const snapshot = await uploadsRef.orderBy("order", "desc").limit(1).get();

    const maxOrder = snapshot.empty ? 0 : snapshot.docs[0].data().order;

    return NextResponse.json({ maxOrder });

  } catch (error) {
    console.error("Error fetching max order:", error);
    return NextResponse.json({ error: "Failed to fetch max order" }, { status: 500 });
  }
}