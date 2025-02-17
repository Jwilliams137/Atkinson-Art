'use client'
import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "../../../utils/firebase";
import styles from "./page.module.css"; // Import the CSS module

const db = getFirestore(app);

const ArtworkPage = () => {
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "artworks"));
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

  return (
    <div className={styles.artworkContainer}>
      {artworks.map((artwork) => (
        <div key={artwork.id} className={styles.artworkCard}>
          <img
            className={styles.artworkImage}
            src={artwork.imageUrl}
            alt={artwork.title}
          />
        </div>
      ))}
    </div>
  );
};

export default ArtworkPage;
