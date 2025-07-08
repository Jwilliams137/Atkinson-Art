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
            const type = data.type;
            const content = data.content;
            const buttonText = data.buttonText;

            if (year || link || content || buttonText) {
              return {
                id: doc.id,
                ...(year && { year }),
                ...(link && { link }),
                ...(type && { type }),
                ...(content && { content }),
                ...(buttonText && { buttonText }),
              };
            }
            return null;
          })
          .filter((item) => item !== null);
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