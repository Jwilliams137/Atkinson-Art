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
          orderBy("order") // Ensure your Firestore documents have this field
        );
        const querySnapshot = await getDocs(q);
        const texts = querySnapshot.docs.map((doc) => doc.data().content);
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
