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
        const year = searchParams.get("year");

        if (!pageType) {
            return NextResponse.json({ error: "PageType is required" }, { status: 400 });
        }

        const textUploadsRef = db.collection("textUploads");

        let queryRef;
        let field;

        if (pageType === "exhibitions" && year) {
            queryRef = textUploadsRef
                .where("pageType", "==", "exhibitions")
                .where("year", "==", year)
                .orderBy("snippetOrder", "desc")
                .limit(1);
            field = "snippetOrder";
        } else {
            queryRef = textUploadsRef
                .where("pageType", "==", pageType)
                .orderBy("order", "desc")
                .limit(1);
            field = "order";
        }

        const snapshot = await queryRef.get();
        const max = snapshot.empty ? 0 : snapshot.docs[0].data()[field];
        const nextOrder = max === 0 ? 1 : max + 1;

        return NextResponse.json({ nextOrder });

    } catch (error) {
        console.error("Error fetching max order:", error);
        return NextResponse.json({ error: "Failed to fetch max order", details: error.message }, { status: 500 });
    }
}