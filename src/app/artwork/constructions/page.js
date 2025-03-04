'use client'
import React, { useState, useEffect } from "react";
import usePageImages from "../../../hooks/usePageImages";
import ImageGallery from "../../../components/ImageGallery/ImageGallery";
import Modal from "../../../components/Modal/Modal";
import styles from "./page.module.css";

const ConstructionsPage = () => {
  const constructionsImages = usePageImages("constructions");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

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
    <div className={styles.constructionsContainer}>
      <ImageGallery
        images={constructionsImages}
        className={styles.constructionsGallery}
        cardClass={styles.constructionsGalleryCard}
        imageClass={styles.constructionsGalleryImage}
        onImageClick={openModal}
      />
      
      {isModalOpen && shouldRenderModal && (
        <Modal
          images={constructionsImages}
          currentImageIndex={currentImageIndex}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default ConstructionsPage;