"use client";
import { useEffect, useState } from "react";
import { getFirestore, collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { app } from "../../../../utils/firebase";
import styles from "./page.module.css";
import Image from "next/image";

const db = getFirestore(app);

const HousesPage = () => {
  const [houseImages, setHouseImages] = useState([]);

  useEffect(() => {
    const fetchHouseImages = async () => {
      try {
        const q = query(
          collection(db, "uploads"),
          where("pageType", "==", "houses"), // Use "houses" as the pageType
          orderBy("order") // Order images by 'order' field
        );
        const querySnapshot = await getDocs(q);

        const images = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setHouseImages(images);
      } catch (error) {
        console.error("Error fetching house images:", error);
      }
    };

    fetchHouseImages();
  }, []);

  if (houseImages.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.houseContainer}>
      {houseImages.map((image) => (
        <div key={image.id} className={styles.houseCard}>
          <Image
            className={styles.houseImage}
            src={image.imageUrl}
            alt={image.title || "House Image"}
            width={image.width || 500} // Default width
            height={image.height || 500} // Default height
            priority
          />
        </div>
      ))}
    </div>
  );
};

export default HousesPage;
