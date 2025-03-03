import { useEffect, useState } from "react";
import { getFirestore, collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { app } from "../utils/firebase";

const db = getFirestore(app);

const usePageImages = (pageType) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        console.log("Fetching images...");
        const q = query(
          collection(db, "uploads"),
          where("pageType", "==", pageType),
          orderBy("order")
        );
        const querySnapshot = await getDocs(q);
    
        const fetchedImages = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
    
        console.log(fetchedImages); // Check the data you're getting
        setImages(fetchedImages);
      } catch (error) {
        console.error(`Error fetching ${pageType} images:`, error);
      }
    };
    

    fetchImages();
  }, [pageType]);

  return images;
};

export default usePageImages;