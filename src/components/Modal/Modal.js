"use client";
import { cld } from "@/utils/cdn";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import styles from "./Modal.module.css";
import ImageDetails from "../ImageDetails/ImageDetails";

const Modal = ({ images, currentImageIndex, closeModal }) => {
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [activeDocIndex, setActiveDocIndex] = useState(currentImageIndex);
  const [isExpanded, setIsExpanded] = useState(false);
  const imgRef = useRef(null);
  const [renderWidth, setRenderWidth] = useState(null);

  const selectedDocument = images[activeDocIndex];

  const imageArray = (() => {
    if (Array.isArray(selectedDocument.imageUrls)) {
      return selectedDocument.imageUrls
        .slice()
        .sort((a, b) => (a.detailOrder ?? 0) - (b.detailOrder ?? 0))
        .filter((img) => img?.url);
    }

    if (selectedDocument.imageUrl) {
      return [
        {
          url: selectedDocument.imageUrl,
          width: selectedDocument.width,
          height: selectedDocument.height,
        },
      ];
    }

    return [];
  })();

  const mainImage = imageArray[mainImageIndex];

  useEffect(() => {
    setActiveDocIndex(currentImageIndex);
    setMainImageIndex(0);
    setIsExpanded(false);
  }, [currentImageIndex]);

  const goToPreviousDocument = useCallback(() => {
    const prevIndex = activeDocIndex === 0 ? images.length - 1 : activeDocIndex - 1;
    setActiveDocIndex(prevIndex);
    setMainImageIndex(0);
    setIsExpanded(false);
  }, [activeDocIndex, images.length]);

  const goToNextDocument = useCallback(() => {
    const nextIndex = (activeDocIndex + 1) % images.length;
    setActiveDocIndex(nextIndex);
    setMainImageIndex(0);
    setIsExpanded(false);
  }, [activeDocIndex, images.length]);

  const measureWidth = useCallback(() => {
    if (imgRef.current) {
      setRenderWidth(Math.round(imgRef.current.clientWidth));
    }
  }, []);

  useEffect(() => {
    measureWidth();
    window.addEventListener("resize", measureWidth);
    return () => window.removeEventListener("resize", measureWidth);
  }, [measureWidth]);

  useEffect(() => {
    const t = setTimeout(measureWidth, 0);
    return () => clearTimeout(t);
  }, [mainImageIndex, activeDocIndex, isExpanded, measureWidth]);

  return (
    <div className={styles.modalBackdrop} onClick={closeModal}>
      <div
        className={styles.modalContent}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.arrowLeft} onClick={goToPreviousDocument} aria-label="Previous Item">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <polygon points="15,6 9,12 15,18" />
          </svg>
        </button>

        <div className={styles.imageContent}>
          <div className={styles.imageWrapper}>
            {mainImage?.url && (
              <Image
                ref={imgRef}
                src={cld(mainImage.url, { width: 1400 })}
                unoptimized
                alt={selectedDocument.title || "Artwork Image"}
                width={mainImage.width}
                height={mainImage.height}
                className={`${styles.fullSizeImage} ${imageArray.length > 1 ? styles.withThumbnails : ""}`}
                onLoad={measureWidth}
                onLoadingComplete={measureWidth}
              />
            )}
          </div>

          {imageArray.length > 1 && (
            <div
              className={styles.thumbnailRow}
              role="tablist"
              aria-label="Other views of this item"
              style={{
                width: renderWidth ? `${renderWidth}px` : "auto",
                margin: "5px auto 0",
              }}
            >
              {imageArray.map((img, index) => (
                <button
                  key={index}
                  className={`${styles.thumbnailButton} ${index === mainImageIndex ? styles.active : ""}`}
                  onClick={() => setMainImageIndex(index)}
                  aria-label={`View image ${index + 1}`}
                  role="tab"
                  aria-selected={index === mainImageIndex}
                >
                  <Image
                    src={cld(img.url, { width: 120 })}
                    unoptimized
                    alt={`Thumbnail ${index + 1}`}
                    width={80}
                    height={80}
                    className={styles.thumbnailImage}
                  />
                </button>
              ))}
            </div>
          )}

          <div
            className={styles.imageLabel}
            style={{ width: renderWidth ? `${renderWidth}px` : "auto", margin: "10px auto 0" }}
          >
            <h2 id="modal-title" className={styles.visuallyHidden}>
              {selectedDocument.title}
            </h2>
            <p id="modal-description" className={styles.visuallyHidden}>
              {selectedDocument.description}
            </p>
            <ImageDetails
              title={selectedDocument.title}
              description={selectedDocument.description}
              dimensions={selectedDocument.dimensions}
              price={selectedDocument.price}
              isExpanded={isExpanded}
              toggleDescription={() => setIsExpanded((prev) => !prev)}
            />
          </div>
        </div>

        <button className={styles.arrowRight} onClick={goToNextDocument} aria-label="Next Item">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <polygon points="9,6 15,12 9,18" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Modal;