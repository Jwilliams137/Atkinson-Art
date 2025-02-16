"use client";
import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "../../../utils/firebase"; // Adjust path based on your setup
import styles from "./page.module.css";

const db = getFirestore(app);

function ArtworkPage() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "artworks"));
        const artList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setArtworks(artList);
      } catch (error) {
        console.error("Error fetching artworks:", error);
      }
    };

    fetchArtworks();
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.grid}>
        {artworks.map((art) => (
          <div key={art.id} className={styles.card}>
            <img src={art.imageUrl} alt={art.title} className={styles.image} />
            <p>{art.title}</p>
          </div>
        ))}
      </div>

      {/* The file input is removed since it's only handled by the admin */}
      {loading && <p>Uploading...</p>}
    </div>
  );
}

export default ArtworkPage;
