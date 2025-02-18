'use client';
import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "../../../utils/firebase";
import styles from "./page.module.css";
import Image from "next/image";

const db = getFirestore(app);

const ArtworkPage = () => {
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "artworks"));
        const artworkData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            width: data.width || 500,
            height: data.height || 500
          };
        });
        setArtworks(artworkData);
      } catch (error) {
        console.error("Error fetching artworks:", error);
      }
    };

    fetchArtworks();
  }, []);

  return (
    <div className={styles.artworkContainer}>
      {artworks.map((artwork) => (
        <div key={artwork.id} className={styles.artworkCard}>
          <Image
            className={styles.artworkImage}
            src={artwork.imageUrl}
            alt={artwork.title}
            width={artwork.width}
            height={artwork.height}
            priority
          />
        </div>
      ))}
    </div>
  );
};

export default ArtworkPage;
