'use client'
import React, { useState, useEffect } from "react"; // Import useState, useEffect
import usePageImages from "../../../hooks/usePageImages";
import ImageGallery from "../../../components/ImageGallery/ImageGallery";
import Modal from "../../../components/Modal/Modal";  // Import the Modal component
import styles from "./page.module.css";

const NewWorkPage = () => {
  const newWorkImages = usePageImages("new-work");

  // State for controlling the modal visibility and selected image index
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Track window width

  // Function to open the modal and set the selected image index
  const openModal = (index) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Only allow the modal to be rendered if the screen width is large enough
  const shouldRenderModal = windowWidth > 1000;

  return (
    <div className={styles.newWorkContainer}>
      <ImageGallery
        images={newWorkImages}
        className={styles.newWorkGallery}
        cardClass={styles.newWorkGalleryCard}
        imageClass={styles.newWorkGalleryImage}
        onImageClick={openModal} // Pass openModal function to ImageGallery
      />

      {/* Conditionally render the Modal based on screen width */}
      {isModalOpen && shouldRenderModal && (
        <Modal
          images={newWorkImages}
          currentImageIndex={currentImageIndex}
          closeModal={closeModal} // Pass closeModal to the Modal
        />
      )}
    </div>
  );
};

export default NewWorkPage;
