"use client";
import { useEffect, useState } from "react";
import { getFirestore, collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { app } from "../../../../utils/firebase";
import styles from "./page.module.css";
import Image from "next/image";

const db = getFirestore(app);

const BioPage = () => {
  const [bioImages, setBioImages] = useState([]);

  useEffect(() => {
    const fetchBioImages = async () => {
      try {
        const q = query(
          collection(db, "uploads"),
          where("pageType", "==", "bio"), // Use "bio" as the pageType
          orderBy("order") // Order images by 'order' field
        );
        const querySnapshot = await getDocs(q);

        const images = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setBioImages(images);
      } catch (error) {
        console.error("Error fetching bio images:", error);
      }
    };

    fetchBioImages();
  }, []);

  if (bioImages.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.bioContainer}>
      {bioImages.map((image) => (
        <div key={image.id} className={styles.bioCard}>
          <Image
            className={styles.bioImage}
            src={image.imageUrl}
            alt={image.title || "Bio Image"}
            width={image.width || 500} // Default width
            height={image.height || 500} // Default height
            priority
          />
        </div>
      ))}
    </div>
  );
};

export default BioPage;
