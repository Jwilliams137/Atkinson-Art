import { useState, useEffect, useCallback } from "react";
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
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchImages = useCallback(async (reset = false) => {
    if (!pageType) return;

    setLoading(true);
    try {
      let q = query(
        collection(db, "uploads"),
        where("pageType", "==", pageType),
        orderBy("order"),
        limit(itemsPerPage)
      );

      if (!reset && lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const querySnapshot = await getDocs(q);

      const fetchedImages = querySnapshot.docs.map((doc) => {
        const data = doc.data();

        const normalizedImageUrls = Array.isArray(data.imageUrls)
          ? data.imageUrls
          : [
            {
              url: data.imageUrl || null,
              cloudinaryId: data.cloudinaryId || null,
              width: data.width || null,
              height: data.height || null,
              detailOrder: 0,
            },
          ];

        return {
          id: doc.id,
          ...data,
          imageUrls: normalizedImageUrls,
          displayUrl: normalizedImageUrls.find(img => img?.url)?.url || null,
        };
      });

      setImages(fetchedImages);

      if (fetchedImages.length < itemsPerPage) {
        setLastDoc(null);
        setHasMore(false);
      } else {
        const nextQuery = query(
          collection(db, "uploads"),
          where("pageType", "==", pageType),
          orderBy("order"),
          startAfter(querySnapshot.docs[querySnapshot.docs.length - 1]),
          limit(1)
        );
        const nextQuerySnapshot = await getDocs(nextQuery);

        if (nextQuerySnapshot.docs.length === 0) {
          setHasMore(false);
        } else {
          setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
          setHasMore(true);
        }
      }

    } catch (error) {
      console.error(`Error fetching ${pageType} images:`, error);
    }
    setLoading(false);
  }, [pageType, lastDoc, itemsPerPage]);

  useEffect(() => {
    fetchImages(true);
  }, [pageType]);

  const nextPage = () => {
    if (hasMore) {
      setPage(prev => prev + 1);
      fetchImages();
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
      fetchImages(true);
    }
  };

  return { images, nextPage, prevPage, loading, page, hasMore };
};

export default usePageImages;