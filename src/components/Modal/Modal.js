import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import styles from "./Modal.module.css";

const Modal = ({ images, currentImageIndex, closeModal }) => {
  const [selectedIndex, setSelectedIndex] = useState(currentImageIndex);

  const goToNextImage = useCallback(() => {
    setSelectedIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const goToPrevImage = useCallback(() => {
    setSelectedIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  const handleScroll = useCallback(
    (event) => {
      event.preventDefault();
      if (event.deltaY > 0) {
        goToNextImage();
      } else if (event.deltaY < 0) {
        goToPrevImage();
      }
    },
    [goToNextImage, goToPrevImage]
  );

  useEffect(() => {
    window.addEventListener("wheel", handleScroll, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, [handleScroll]);

  const selectedImage = images[selectedIndex];

  return (
    <div className={styles.modalBackdrop} onClick={closeModal}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.imageWrapper}>
          <Image
            src={selectedImage.imageUrl}
            alt={`Image ${selectedIndex + 1}`}
            width={selectedImage.width}
            height={selectedImage.height}
            className={styles.fullSizeImage}
          />
        </div>
        <div className={styles.imageLabel}>
          <p className={styles.imageTitle}>{selectedImage.title}</p>
          <p>{selectedImage.description}</p>
          <p>{selectedImage.dimensions}</p>
        </div>
      </div>
    </div>
  );
};

export default Modal;