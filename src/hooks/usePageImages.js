import { useState, useEffect } from "react";
import { getFirestore, collection, query, where, orderBy, limit, getDocs, startAfter } from "firebase/firestore";
import { app } from "../utils/firebase"; // Adjust if needed

const db = getFirestore(app);

const usePageImages = (pageType, itemsPerPage = 20) => {
  const [images, setImages] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!pageType) return;
    fetchImages(true); // Load first page
  }, [pageType]);

  const fetchImages = async (reset = false) => {
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
      const fetchedImages = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setImages(reset ? fetchedImages : [...images, ...fetchedImages]); // Append new images
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
    } catch (error) {
      console.error(`Error fetching ${pageType} images:`, error);
    }
    setLoading(false);
  };

  const nextPage = () => {
    if (lastDoc) {
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

  return { images, nextPage, prevPage, loading, page, hasMore: !!lastDoc };
};

export default usePageImages;
