"use client";

import { useEffect, useState } from "react";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app"; // Import getApps
import usePageImages from "../../../hooks/usePageImages";
import ImageGallery from "../../../components/ImageGallery/ImageGallery";
import styles from "./page.module.css";

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase app only if it's not already initialized
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig); // Initialize app only if no app is initialized
} else {
  app = getApps()[0]; // Use the existing app if it has already been initialized
}
const db = getFirestore(app); // Use the initialized app

const BioPage = () => {
  const [resumeUrl, setResumeUrl] = useState(null);
  const bioImages = usePageImages("bio");

  useEffect(() => {
    const fetchResume = async () => {
      try {
        // Query the Firestore collection to find the document where type is "resume"
        const q = query(collection(db, "yourCollectionName"), where("type", "==", "resume"));
        const querySnapshot = await getDocs(q);

        // If a document is found, get the URL
        querySnapshot.forEach((doc) => {
          setResumeUrl(doc.data().url); // Assuming your document has a field `url` for the resume URL
        });
      } catch (error) {
        console.error("Error fetching resume:", error);
      }
    };

    fetchResume();
  }, []);

  return (
    <div className={styles.bioContainer}>
      <ImageGallery images={bioImages} className={styles.bioGallery} />

      {resumeUrl && (
        <p>
          <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
            Click here to download a PDF of my resume.
          </a>
        </p>
      )}
    </div>
  );
};

export default BioPage;
