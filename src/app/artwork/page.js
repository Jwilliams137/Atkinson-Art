"use client";
import { useEffect, useState } from "react";
import { getFirestore, collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { app } from "../../utils/firebase";
import styles from "./page.module.css";
import Image from "next/image";

const db = getFirestore(app);

const ArtworkPage = () => {
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const q = query(
          collection(db, "uploads"),
          where("pageType", "==", "artwork"),
          orderBy("order") // Order artworks by 'order' field
        );
        const querySnapshot = await getDocs(q);

        const artworkData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setArtworks(artworkData);
      } catch (error) {
        console.error("Error fetching artworks:", error);
      }
    };

    fetchArtworks();
  }, []);

  if (artworks.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.artworkContainer}>
      {artworks.map((artwork) => (
        <div key={artwork.id} className={styles.artworkCard}>
          <Image
            className={styles.artworkImage}
            src={artwork.imageUrl}
            alt={artwork.title || "Artwork"}
            width={artwork.width || 500} // Default width
            height={artwork.height || 500} // Default height
            priority
          />
        </div>
      ))}
    </div>
  );
};

export default ArtworkPage;
