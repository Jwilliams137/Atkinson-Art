// src/utils/homeInitialServer.js
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/utils/firebase";

// Fetch the first N "home" images on the server.
// Mirrors your client shape so we can render the same UI.
export async function getInitialHomeImages(count = 20) {
  // NOTE: If you have an order (e.g., createdAt), add orderBy(...) here.
  const q = query(
    collection(db, "uploads"),
    where("pageType", "==", "home"),
    limit(count)
  );

  const snap = await getDocs(q);
  const items = [];

  snap.forEach((doc) => {
    const d = doc.data();
    // Pick first image variant, falling back to single imageUrl
    let url, w, h, imageUrls = [];
    if (Array.isArray(d.imageUrls) && d.imageUrls.length > 0) {
      const first = d.imageUrls[0];
      url = first?.url;
      w = first?.width;
      h = first?.height;
      imageUrls = d.imageUrls.filter(x => !!x?.url);
    } else if (d.imageUrl && d.width && d.height) {
      url = d.imageUrl; w = d.width; h = d.height;
    }

    if (!url) return; // skip invalid rows

    items.push({
      id: doc.id,
      title: d.title || "",
      description: d.description || "",
      dimensions: d.dimensions || "",
      price: d.price || "",
      imageUrl: url,
      width: w || 600,
      height: h || 400,
      imageUrls, // keep extra views if present
    });
  });

  return items;
}
