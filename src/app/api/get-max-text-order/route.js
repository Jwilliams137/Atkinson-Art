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

    // Query the textUploads collection to get the latest order for the given pageType
    const textUploadsRef = db.collection("textUploads").where("pageType", "==", pageType);
    const snapshot = await textUploadsRef.orderBy("order", "desc").limit(1).get();

    // Get the max order (if any)
    const maxOrder = snapshot.empty ? 0 : snapshot.docs[0].data().order;

    // If maxOrder is 0 (i.e., no uploads), start with 1. Otherwise, increment by 1
    const nextOrder = maxOrder === 0 ? 1 : maxOrder + 1;

    return NextResponse.json({ nextOrder });

  } catch (error) {
    console.error("Error fetching max order:", error);
    return NextResponse.json({ error: "Failed to fetch max order", details: error.message }, { status: 500 });
  }
}
