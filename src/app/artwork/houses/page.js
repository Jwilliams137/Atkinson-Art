"use client";
import { useEffect, useState } from "react";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import usePageImages from "../../../hooks/usePageImages";
import ImageGallery from "../../../components/ImageGallery/ImageGallery";
import styles from "./page.module.css";

// Initialize Firebase Firestore
import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}
const db = getFirestore(app);

const HousesPage = () => {
  const [textUploads, setTextUploads] = useState([]);
  const housesImages = usePageImages("houses");

  useEffect(() => {
    const fetchTextUploads = async () => {
      try {
        const q = query(collection(db, "textUploads"), where("pageType", "==", "houses"));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.log("No textUploads found with pageType 'houses'");
        } else {
          const texts = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            console.log("Fetched textUpload:", data);
            return data.content;
          });
          setTextUploads(texts);
        }
      } catch (error) {
        console.error("Error fetching text uploads:", error);
      }
    };

    fetchTextUploads();
  }, []);

  return (
    <div>
      <ImageGallery images={housesImages}
        className={styles.housesGallery}
        cardClass={styles.housesGalleryCard}
        imageClass={styles.housesGalleryImage} />
      <div className={styles.housesContainer}>
        {textUploads.length > 0 ? (
          <div className={styles.textSection}>
            {textUploads.map((text, index) => (
              <p className={styles.text} key={index}>{text}</p>
            ))}
          </div>
        ) : (
          <p>No text available.</p>
        )}
      </div>
    </div>

  );
};

export default HousesPage;
