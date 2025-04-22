import { useState, useEffect } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";

const useTextUploads = (pageType) => {
  const [textUploads, setTextUploads] = useState([]);

  useEffect(() => {
    const fetchTextUploads = async () => {
      try {
        const q = query(
          collection(db, "textUploads"),
          where("pageType", "==", pageType),
          orderBy("order")
        );
        const querySnapshot = await getDocs(q);
        const texts = querySnapshot.docs
          .map((doc) => {
            const data = doc.data();
            const year = data.year;
            const link = data.link;
            const type = data.type
            // Only return if at least one of them exists
            if (year || link) {
              return {
                ...(year && { year }),
                ...(link && { link }),
                ...(type && { type })
              };
            }
            return null;
          })
          .filter((item) => item !== null); // Remove nulls
        setTextUploads(texts);
      } catch (error) {
        console.error("Error fetching text uploads:", error);
      }
    };

    fetchTextUploads();
  }, [pageType]);

  return textUploads;
};

export default useTextUploads;
