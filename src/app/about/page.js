"use client";
import { useEffect, useState } from "react";
import { getFirestore, collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { app } from "../../utils/firebase";
import styles from "./page.module.css";
import Image from "next/image";

const db = getFirestore(app);

const AboutPage = () => {
  const [aboutImages, setAboutImages] = useState([]);

  useEffect(() => {
    const fetchAboutImages = async () => {
      try {
        const q = query(
          collection(db, "uploads"),
          where("pageType", "==", "about"), // Use "about" as the pageType
          orderBy("order") // Order images by 'order' field
        );
        const querySnapshot = await getDocs(q);

        const images = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAboutImages(images);
      } catch (error) {
        console.error("Error fetching about images:", error);
      }
    };

    fetchAboutImages();
  }, []);

  if (aboutImages.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.aboutContainer}>
      {aboutImages.map((image) => (
        <div key={image.id} className={styles.aboutCard}>
          <Image
            className={styles.aboutImage}
            src={image.imageUrl}
            alt={image.title || "About Image"}
            width={image.width || 500} // Default width
            height={image.height || 500} // Default height
            priority
          />
        </div>
      ))}
    </div>
  );
};

export default AboutPage;
