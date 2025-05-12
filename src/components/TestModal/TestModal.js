"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import styles from "./TestModal.module.css";
import ImageDetails from "../ImageDetails/ImageDetails";

const Modal = ({ images, currentImageIndex, closeModal }) => {
  const [selectedIndex, setSelectedIndex] = useState(currentImageIndex);
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollTimeoutRef = useRef(null);

  const goToNextImage = useCallback(() => {
    setIsExpanded(false);
    setSelectedIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const goToPrevImage = useCallback(() => {
    setIsExpanded(false);
    setSelectedIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  const handleScroll = useCallback(
    (event) => {
      event.preventDefault();
      if (scrollTimeoutRef.current) return;

      if (event.deltaY > 0) {
        goToNextImage();
      } else if (event.deltaY < 0) {
        goToPrevImage();
      }

      scrollTimeoutRef.current = setTimeout(() => {
        scrollTimeoutRef.current = null;
      }, 400);
    },
    [goToNextImage, goToPrevImage]
  );

  useEffect(() => {
    window.addEventListener("wheel", handleScroll, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleScroll);
      clearTimeout(scrollTimeoutRef.current);
    };
  }, [handleScroll]);

  const selectedImage = images[selectedIndex];

  return (
    <div className={styles.modalBackdrop} onClick={closeModal}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.imageContent}>
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
            <ImageDetails
              title={selectedImage.title}
              description={selectedImage.description}
              dimensions={selectedImage.dimensions}
              price={selectedImage.price}
              isExpanded={isExpanded}
              toggleDescription={() => setIsExpanded((prev) => !prev)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;