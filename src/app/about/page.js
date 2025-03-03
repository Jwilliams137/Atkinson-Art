"use client";
import React from 'react';
import { useEffect, useState } from "react";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";
import usePageImages from "../../hooks/usePageImages";
import ImageGallery from "../../components/ImageGallery/ImageGallery";
import styles from "./page.module.css";

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

const AboutPage = () => {
  const [textUploads, setTextUploads] = useState([]);
  const aboutImages = usePageImages("about");

  useEffect(() => {
    const fetchTextUploads = async () => {
      try {
        const q = query(collection(db, "textUploads"), where("pageType", "==", "about"));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.log("No text uploads found with pageType 'about'");
        } else {
          const texts = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            console.log("Fetched text upload:", data);
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
    <div className={styles.aboutContainer}>
      {textUploads.length > 0 && (
        <div className={styles.textSection}>
        {textUploads.map((text, index) => (
          <div
            key={index}
            className={styles.text}
            dangerouslySetInnerHTML={{
              __html: text
                .split("\n\n") // Split only on double new lines (paragraph breaks)
                .map((para) => `<p>${para.trim()}</p>`) // Wrap each in a proper <p>
                .join(""), // Join them back as valid HTML
            }}
          />
        ))}
      </div>
      
      )}
      <ImageGallery images={aboutImages} className={styles.aboutGallery} />
    </div>
  );
};

export default AboutPage;
