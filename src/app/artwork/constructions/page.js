"use client";
import { useEffect, useState } from "react";
import { getFirestore, collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { app } from "../../../../utils/firebase";
import styles from "./page.module.css";
import Image from "next/image";

const db = getFirestore(app);

const ConstructionsPage = () => {
  const [constructionImages, setConstructionImages] = useState([]);

  useEffect(() => {
    const fetchConstructionImages = async () => {
      try {
        const q = query(
          collection(db, "uploads"),
          where("pageType", "==", "constructions"), // Use "constructions" as the pageType
          orderBy("order") // Order images by 'order' field
        );
        const querySnapshot = await getDocs(q);

        const images = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setConstructionImages(images);
      } catch (error) {
        console.error("Error fetching construction images:", error);
      }
    };

    fetchConstructionImages();
  }, []);

  if (constructionImages.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.constructionContainer}>
      {constructionImages.map((image) => (
        <div key={image.id} className={styles.constructionCard}>
          <Image
            className={styles.constructionImage}
            src={image.imageUrl}
            alt={image.title || "Construction Image"}
            width={image.width || 500} // Default width
            height={image.height || 500} // Default height
            priority
          />
        </div>
      ))}
    </div>
  );
};

export default ConstructionsPage;
