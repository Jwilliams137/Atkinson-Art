// src/utils/artworkInitialServer.js
import { collection, query, where, getDocs, limit, orderBy } from "firebase/firestore";
import { db } from "@/utils/firebase";

// Fetches the first N "artwork" items in the same order as the client.
export async function getInitialArtworkImages(count = 12) {
  const q = query(
    collection(db, "uploads"),
    where("pageType", "==", "artwork"),
    orderBy("order"),
    limit(count)
  );

  const snap = await getDocs(q);
  const items = [];

  snap.forEach((doc) => {
    const d = doc.data();

    // Normalize and sort any multi-image arrays so index 0 is deterministic
    const imageUrls = Array.isArray(d.imageUrls) && d.imageUrls.length
      ? d.imageUrls
          .filter(x => !!x?.url)
          .map(x => ({
            url: x.url,
            width: x.width ?? null,
            height: x.height ?? null,
            cloudinaryId: x.cloudinaryId ?? null,
            detailOrder: typeof x.detailOrder === "number" ? x.detailOrder : 0,
          }))
          .sort((a, b) => (a.detailOrder ?? 0) - (b.detailOrder ?? 0))
      : (d.imageUrl ? [{
          url: d.imageUrl,
          width: d.width ?? null,
          height: d.height ?? null,
          cloudinaryId: d.cloudinaryId ?? null,
          detailOrder: 0,
        }] : []);

    const top = imageUrls[0];
    if (!top?.url) return;

    items.push({
      id: doc.id,
      title: d.title || "",
      description: d.description || "",
      dimensions: d.dimensions || "",
      price: d.price || "",
      imageUrls,
      imageUrl: top.url,
      width: top.width || 600,
      height: top.height || 450,
    });
  });

  return items;
}