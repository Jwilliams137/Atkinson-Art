'use client'
import React, { useState, useEffect } from "react";
import usePageImages from "../../../hooks/usePageImages";
import ImageGallery from "../../../components/ImageGallery/ImageGallery";
import Modal from "../../../components/Modal/Modal";
import useTextUploads from "../../../hooks/useTextUploads";
import TextSection from "../../../components/TextSection/TextSection";
import styles from "./page.module.css";

const NewWorkPage = () => {
  const newWorkImages = usePageImages("new-work");
  const newWorkTextUploads = useTextUploads("new-work");
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
    <div className={styles.newWorkContainer}>
      <ImageGallery
        images={newWorkImages}
        className={styles.newWorkGallery}
        cardClass={styles.newWorkGalleryCard}
        imageClass={styles.newWorkGalleryImage}
        onImageClick={openModal}
        mobileLabelClass={styles.newWorkMobileLabel}
        mobileTitleClass={styles.newWorkMobileTitle}
      />
      <div className={styles.text}>
        <TextSection textUploads={newWorkTextUploads}
          containerClass={styles.newWorkTextContainer}
          sectionClass={styles.newWorkTextSection}
          textClass={styles.newWorkText} />
      </div>
      {isModalOpen && shouldRenderModal && (
        <Modal
          images={newWorkImages}
          currentImageIndex={currentImageIndex}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default NewWorkPage;