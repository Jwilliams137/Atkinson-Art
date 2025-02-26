"use client";
import { useEffect, useState } from "react";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";
import usePageImages from "../../../hooks/usePageImages";
import ImageGallery from "../../../components/ImageGallery/ImageGallery";
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

const BioPage = () => {
  const [resumeUrl, setResumeUrl] = useState(null);
  const [textUploads, setTextUploads] = useState([]);
  const bioImages = usePageImages("bio");

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "resumes"));
        querySnapshot.forEach((doc) => {
          const resumeData = doc.data();
          if (resumeData?.resumeUrl) {
            setResumeUrl(resumeData.resumeUrl);
          }
        });
      } catch (error) {
        console.error("Error fetching resumes:", error);
      }
    };

    const fetchTextUploads = async () => {
      try {
        const q = query(collection(db, "textUploads"), where("pageType", "==", "bio"));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.log("No textUploads found with pageType 'bio'");
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

    fetchResume();
    fetchTextUploads();
  }, []);

  return (
    <div className={styles.bioContainer}>
      <h2>Biography</h2>
      {textUploads.length > 0 ? (
        <div className={styles.textSection}>
          {textUploads.map((text, index) => (
            <p key={index}>{text}</p>
          ))}
        </div>
      ) : (
        <p>No text available.</p>
      )}
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