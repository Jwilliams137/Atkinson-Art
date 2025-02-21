"use client";
import { useEffect, useState } from "react";
import { getFirestore, collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { app } from "../utils/firebase";
import styles from "./page.module.css";
import Image from "next/image";

const db = getFirestore(app);

// Define the expected shape of each image document
interface ImageData {
  id: string;
  imageUrl: string;
  title?: string;
  width: number;
  height: number;
  order: number;  // Add the 'order' field here
}

const HomePage = () => {
  const [homeImages, setHomeImages] = useState<ImageData[]>([]);

  useEffect(() => {
    const fetchHomeImages = async () => {
      try {
        const q = query(
          collection(db, "uploads"),
          where("pageType", "==", "home"),
          orderBy("order")  // Order by the 'order' field
        );
        const querySnapshot = await getDocs(q);

        const images: ImageData[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ImageData[];

        setHomeImages(images);
      } catch (error) {
        console.error("Error fetching home images:", error);
      }
    };

    fetchHomeImages();
  }, []);

  if (homeImages.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.homePageContainer}>
      {homeImages.map((image) =>
        image.imageUrl ? (
          <Image
            key={image.id}
            src={image.imageUrl}
            alt={image.title || "Uploaded image"}
            width={image.width}
            height={image.height}
            priority
          />
        ) : null
      )}
    </div>
  );
};

export default HomePage;


