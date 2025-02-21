"use client";
import { useEffect, useState } from "react";
import { getFirestore, collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { app } from "../../../../utils/firebase";
import styles from "./page.module.css";
import Image from "next/image";

const db = getFirestore(app);

const NewWorkPage = () => {
  const [workImages, setWorkImages] = useState([]);

  useEffect(() => {
    const fetchWorkImages = async () => {
      try {
        const q = query(
          collection(db, "uploads"),
          where("pageType", "==", "new-work"), // Updated to "new-work"
          orderBy("order") // Order images by 'order' field
        );
        const querySnapshot = await getDocs(q);

        const images = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setWorkImages(images);
      } catch (error) {
        console.error("Error fetching new work images:", error);
      }
    };

    fetchWorkImages();
  }, []);

  if (workImages.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.workContainer}>
      {workImages.map((image) => (
        <div key={image.id} className={styles.workCard}>
          <Image
            className={styles.workImage}
            src={image.imageUrl}
            alt={image.title || "New Work Image"}
            width={image.width || 500} // Default width
            height={image.height || 500} // Default height
            priority
          />
        </div>
      ))}
    </div>
  );
};

export default NewWorkPage;
