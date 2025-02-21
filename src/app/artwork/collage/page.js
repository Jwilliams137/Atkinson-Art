"use client";
import { useEffect, useState } from "react";
import { getFirestore, collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { app } from "../../../../utils/firebase";
import styles from "./page.module.css";
import Image from "next/image";

const db = getFirestore(app);

const CollagePage = () => {
  const [collageImages, setCollageImages] = useState([]);

  useEffect(() => {
    const fetchCollageImages = async () => {
      try {
        const q = query(
          collection(db, "uploads"),
          where("pageType", "==", "collage"), // Use "collage" as the pageType
          orderBy("order") // Order images by 'order' field
        );
        const querySnapshot = await getDocs(q);

        const images = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCollageImages(images);
      } catch (error) {
        console.error("Error fetching collage images:", error);
      }
    };

    fetchCollageImages();
  }, []);

  if (collageImages.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.collageContainer}>
      {collageImages.map((image) => (
        <div key={image.id} className={styles.collageCard}>
          <Image
            className={styles.collageImage}
            src={image.imageUrl}
            alt={image.title || "Collage Image"}
            width={image.width || 500} // Default width
            height={image.height || 500} // Default height
            priority
          />
        </div>
      ))}
    </div>
  );
};

export default CollagePage;
