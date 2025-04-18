import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import styles from "./Modal.module.css";
import Link from "next/link";

const Modal = ({ images, currentImageIndex, closeModal }) => {
  const [selectedIndex, setSelectedIndex] = useState(currentImageIndex);
  const scrollTimeoutRef = useRef(null);

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
      if (scrollTimeoutRef.current) {
        return;
      }

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
          {selectedImage.dimensions && (<p>{selectedImage.dimensions}</p>)}
          {selectedImage.price && (
            <Link href="/shop"><p>{selectedImage.price}</p></Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;