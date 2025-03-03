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
  const [windowWidth, setWindowWidth] = useState(0); // Default to 0 until client-side code runs

  // Check if we're in the browser before trying to access window
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Only run this code on the client side
      setWindowWidth(window.innerWidth); // Set initial width when the component mounts

      const handleResize = () => {
        setWindowWidth(window.innerWidth);
        // Close the modal if the screen is resized below 1000px
        if (window.innerWidth <= 1000) {
          setIsModalOpen(false);
        }
      };

      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    }
  }, []); // Empty dependency array ensures this runs only once when component mounts

  // Function to open the modal and set the selected image index
  const openModal = (index) => {
    if (windowWidth > 1000) {
      setCurrentImageIndex(index);
      setIsModalOpen(true);
    }
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Only render the modal if the screen width is large enough
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
