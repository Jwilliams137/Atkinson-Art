import { useState, useEffect, useRef, useCallback } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  startAfter
} from "firebase/firestore";
import { app } from "../utils/firebase";

const db = getFirestore(app);

const usePageImages = (pageType, itemsPerPage = 20) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const cursorsRef = useRef([]);
  const inFlightRef = useRef(false);

  const buildBaseQuery = useCallback(() => {
    return query(
      collection(db, "uploads"),
      where("pageType", "==", pageType),
      orderBy("order"),
      limit(itemsPerPage)
    );
  }, [pageType, itemsPerPage]);

  const normalizeDocs = (docs) =>
    docs.map((doc) => {
      const data = doc.data();

      const normalizedImageUrls =
        Array.isArray(data.imageUrls) && data.imageUrls.length > 0
          ? data.imageUrls
              .filter((img) => img?.url)
              .map((img) => ({
                url: img.url,
                cloudinaryId: img.cloudinaryId ?? null,
                width: img.width ?? null,
                height: img.height ?? null,
                detailOrder: typeof img.detailOrder === "number" ? img.detailOrder : 0,
              }))
              .sort((a, b) => (a.detailOrder ?? 0) - (b.detailOrder ?? 0))
          : [
              {
                url: data.imageUrl || null,
                cloudinaryId: data.cloudinaryId || null,
                width: data.width || null,
                height: data.height || null,
                detailOrder: 0,
              },
            ];

      const displayUrl = normalizedImageUrls.find((img) => img?.url)?.url || null;

      return {
        id: doc.id,
        ...data,
        imageUrls: normalizedImageUrls,
        displayUrl,
      };
    });

  const fetchPage = useCallback(
    async (targetPage) => {
      if (!pageType || inFlightRef.current) return;

      inFlightRef.current = true;
      setLoading(true);
      try {
        let q = buildBaseQuery();

        if (targetPage > 1) {
          const prevCursor = cursorsRef.current[targetPage - 2];
          q = prevCursor ? query(buildBaseQuery(), startAfter(prevCursor)) : buildBaseQuery();
        }

        const snap = await getDocs(q);
        const docs = normalizeDocs(snap.docs);
        setImages(docs);

        if (snap.docs.length > 0) {
          cursorsRef.current[targetPage - 1] = snap.docs[snap.docs.length - 1];
        }

        if (snap.docs.length < itemsPerPage) {
          setHasMore(false);
        } else {
          const lastVisible = snap.docs[snap.docs.length - 1];
          const nextSnap = await getDocs(
            query(buildBaseQuery(), startAfter(lastVisible), limit(1))
          );
          setHasMore(nextSnap.size > 0);
        }
      } catch (error) {
        console.error(`Error fetching ${pageType} images:`, error);
      } finally {
        setLoading(false);
        inFlightRef.current = false;
      }
    },
    [pageType, itemsPerPage, buildBaseQuery]
  );

  useEffect(() => {
    cursorsRef.current = [];
    setImages([]);
    setPage(1);
    setHasMore(false);
    if (pageType) fetchPage(1);
  }, [pageType, itemsPerPage]);

  const nextPage = async () => {
    if (loading || !hasMore) return;
    const next = page + 1;
    setPage(next);
    await fetchPage(next);
  };

  const prevPage = async () => {
    if (loading || page === 1) return;
    const prev = page - 1;
    setPage(prev);
    await fetchPage(prev);
  };

  return { images, nextPage, prevPage, loading, page, hasMore };
};

export default usePageImages;