"use client";
import { useEffect, useState } from "react";
import { getFirestore, collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { app } from "../../../../utils/firebase";
import styles from "./page.module.css";
import Image from "next/image";

const db = getFirestore(app);

const ExhibitionsPage = () => {
  const [exhibitionsImages, setExhibitionsImages] = useState([]);

  useEffect(() => {
    const fetchExhibitionsImages = async () => {
      try {
        const q = query(
          collection(db, "uploads"),
          where("pageType", "==", "exhibitions"), // Use "exhibitions" as the pageType
          orderBy("order") // Order images by 'order' field
        );
        const querySnapshot = await getDocs(q);

        const images = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setExhibitionsImages(images);
      } catch (error) {
        console.error("Error fetching exhibitions images:", error);
      }
    };

    fetchExhibitionsImages();
  }, []);

  if (exhibitionsImages.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.exhibitionsContainer}>
      {exhibitionsImages.map((image) => (
        <div key={image.id} className={styles.exhibitionsCard}>
          <Image
            className={styles.exhibitionsImage}
            src={image.imageUrl}
            alt={image.title || "Exhibitions Image"}
            width={image.width || 500} // Default width
            height={image.height || 500} // Default height
            priority
          />
        </div>
      ))}
    </div>
  );
};

export default ExhibitionsPage;
