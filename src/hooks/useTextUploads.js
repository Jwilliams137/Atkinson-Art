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
        const texts = querySnapshot.docs.map((doc) => ({
          content: doc.data().content,
          year: doc.data().year || "",
          link: doc.data().link || ""
        }));
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