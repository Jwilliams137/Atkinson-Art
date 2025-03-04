'use client'
import React, { useState, useEffect } from "react";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import usePageImages from "../../../hooks/usePageImages";
import ImageGallery from "../../../components/ImageGallery/ImageGallery";
import Modal from "../../../components/Modal/Modal";
import styles from "./page.module.css";
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
  const housesImages = usePageImages("houses");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const [textUploads, setTextUploads] = useState([]);

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);

      const handleResize = () => {
        setWindowWidth(window.innerWidth);
        if (window.innerWidth <= 1000) {
          setIsModalOpen(false);
        }
      };

      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const openModal = (index) => {
    if (windowWidth > 1000) {
      setCurrentImageIndex(index);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const shouldRenderModal = windowWidth > 1000;

  return (
    <div>
<div className={styles.housesContainer}>
      <ImageGallery
        images={housesImages}
        className={styles.housesGallery}
        cardClass={styles.housesGalleryCard}
        imageClass={styles.housesGalleryImage}
        onImageClick={openModal}
        mobileLabelClass={styles.housesMobileLabel}
        mobileTitleClass={styles.housesMobileTitle}
      />
      
      {isModalOpen && shouldRenderModal && (
        <Modal
          images={housesImages}
          currentImageIndex={currentImageIndex}
          closeModal={closeModal}
        />
      )}
    </div>
    <div>
      <div className={styles.textContainer}>
        {textUploads.length > 0 && (
          <div className={styles.textSection}>
            {textUploads.map((text, index) => (
              <p className={styles.text} key={index}>{text}</p>
            ))}
          </div>
        )}
      </div>
    </div>
    </div>    
  );
};

export default HousesPage;