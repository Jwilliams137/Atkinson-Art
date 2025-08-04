import { useState, useEffect } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";

const useTextUploads = (pageType) => {
  const [textUploads, setTextUploads] = useState([]);

  useEffect(() => {
    const fetchTextUploads = async () => {
      try {
        const orderField = pageType === "exhibitions" ? "snippetOrder" : "order";

        const q = query(
          collection(db, "textUploads"),
          where("pageType", "==", pageType),
          orderBy(orderField)
        );

        const querySnapshot = await getDocs(q);
        const texts = querySnapshot.docs
          .map((doc) => {
            const data = doc.data();

            return {
              id: doc.id,
              year: data.year ?? null,
              link: data.link ?? null,
              type: data.type ?? null,
              content: data.content ?? null,
              buttonText: data.buttonText ?? null,
              order: data.order ?? null,
              snippetOrder: data.snippetOrder ?? null,
              pageType: data.pageType ?? null,
            };
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