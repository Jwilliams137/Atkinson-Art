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
    const allowedAdmins = [process.env.ADMIN_EMAIL_1, process.env.ADMIN_EMAIL_2];

    if (!allowedAdmins.includes(userEmail)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const title = formData.get("title");
    const description = formData.get("description");
    const dimensions = formData.get("dimensions")
    const width = formData.get("width");
    const height = formData.get("height");
    const pageType = formData.get("pageType");
    const imageId = formData.get("imageId");
    const moveDirection = formData.get("moveDirection");
    const color = formData.get("color");
    console.log("Description:", description);

    console.log("Received formData:", {
      title,
      description,
      dimensions,
      width,
      height,
      pageType,
      color,
    });
    

    if (!file && !imageId) {
      return NextResponse.json({ error: "No file or imageId provided" }, { status: 400 });
    }

    if (imageId && moveDirection) {
      const imageRef = db.collection("uploads").doc(imageId);
      const imageDoc = await imageRef.get();

      if (!imageDoc.exists) {
        return NextResponse.json({ error: "Image not found" }, { status: 404 });
      }

      const image = imageDoc.data();
      const currentOrder = image.order;

      const adjacentImageQuery = db.collection("uploads")
        .where("pageType", "==", image.pageType)
        .where("order", moveDirection === "up" ? "<" : ">", currentOrder)
        .orderBy("order", moveDirection === "up" ? "desc" : "asc")
        .limit(1);

      const adjacentImageSnapshot = await adjacentImageQuery.get();

      if (!adjacentImageSnapshot.empty) {
        const adjacentImage = adjacentImageSnapshot.docs[0];
        const adjacentImageRef = adjacentImage.ref;

        await db.runTransaction(async (transaction) => {
          const [imageDoc, adjacentImageDoc] = await Promise.all([
            transaction.get(imageRef),
            transaction.get(adjacentImageRef),
          ]);

          const imageData = imageDoc.data();
          const adjacentImageData = adjacentImageDoc.data();
          const tempOrder = imageData.order;
          transaction.update(imageRef, { order: adjacentImageData.order });
          transaction.update(adjacentImageRef, { order: tempOrder });
        });

        return NextResponse.json({ message: "Image reordered successfully" });
      }

      return NextResponse.json({ error: "No adjacent image found" }, { status: 400 });
    }

    if (file) {
      let maxOrder = 0;
      const uploadsRef = db.collection("uploads").where("pageType", "==", pageType);
      const snapshot = await uploadsRef.orderBy("order", "desc").limit(1).get();

      if (!snapshot.empty) {
        maxOrder = snapshot.docs[0].data().order;
      }

      const newOrder = maxOrder + 1;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;
      const uploadResponse = await cloudinary.v2.uploader.upload(base64Image, {
        folder: "uploads",
      });

      await db.collection("uploads").add({
        pageType: pageType || "home",
        title: title || "No Title",
        description: description || "",
        dimensions: dimensions || "",
        imageUrl: uploadResponse.secure_url,
        cloudinaryId: uploadResponse.public_id,
        createdAt: new Date(),
        width: width ? parseInt(width) : null,
        height: height ? parseInt(height) : null,
        order: newOrder,
        color: color || "default",
      });

      return NextResponse.json({
        message: "Upload successful",
        url: uploadResponse.secure_url,
        cloudinaryId: uploadResponse.public_id,
        width: width ? parseInt(width) : null,
        height: height ? parseInt(height) : null,
        order: newOrder,
        color: color || "default",
      });
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Upload failed:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}