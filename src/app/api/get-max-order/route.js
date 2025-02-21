// File: /app/api/get-max-order/route.js

import { NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";

const db = getFirestore();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const pageType = searchParams.get("pageType");

    if (!pageType) {
      return NextResponse.json({ error: "PageType is required" }, { status: 400 });
    }

    // Fetch the highest order for the given pageType
    const uploadsRef = db.collection("uploads").where("pageType", "==", pageType);
    const snapshot = await uploadsRef.orderBy("order", "desc").limit(1).get();

    const maxOrder = snapshot.empty ? 0 : snapshot.docs[0].data().order;  // Default to 0 if no records

    return NextResponse.json({ maxOrder });

  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch max order" }, { status: 500 });
  }
}
