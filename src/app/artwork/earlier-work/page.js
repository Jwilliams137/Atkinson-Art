"use client";
import { useEffect, useState } from "react";
import { getFirestore, collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { app } from "../../../../utils/firebase";
import styles from "./page.module.css";
import Image from "next/image";

const db = getFirestore(app);

const EarlierWorkPage = () => {
  const [earlierWorkImages, setEarlierWorkImages] = useState([]);

  useEffect(() => {
    const fetchEarlierWorkImages = async () => {
      try {
        const q = query(
          collection(db, "uploads"),
          where("pageType", "==", "earlier-work"), // Use "earlier-work" as the pageType
          orderBy("order") // Order images by 'order' field
        );
        const querySnapshot = await getDocs(q);

        const images = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setEarlierWorkImages(images);
      } catch (error) {
        console.error("Error fetching earlier work images:", error);
      }
    };

    fetchEarlierWorkImages();
  }, []);

  if (earlierWorkImages.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.earlierWorkContainer}>
      {earlierWorkImages.map((image) => (
        <div key={image.id} className={styles.earlierWorkCard}>
          <Image
            className={styles.earlierWorkImage}
            src={image.imageUrl}
            alt={image.title || "Earlier Work Image"}
            width={image.width || 500} // Default width
            height={image.height || 500} // Default height
            priority
          />
        </div>
      ))}
    </div>
  );
};

export default EarlierWorkPage;
