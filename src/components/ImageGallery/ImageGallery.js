"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./ImageGallery.module.css";
import ImageDetails from "../ImageDetails/ImageDetails";

const ImageGallery = ({
  images,
  onImageClick = () => { },
  nextPage,
  prevPage,
  page,
  hasMore,
  itemsPerPage,
}) => {
  const showPagination =
    page > 1 || (hasMore && images.length === itemsPerPage);

  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  const toggleDescription = (index) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className={styles.galleryContainer}>
      <div className={styles.gallery}>
        {images.length > 0 &&
          images.map((image, index) => {
            const isExpanded = expandedDescriptions[index];
            return (
              <div key={image.id || index} className={styles.galleryCard}>
                <div className={styles.imageWrapper}>
                  <Image
                    className={styles.image}
                    src={image.imageUrl}
                    alt={image.title || "Gallery Image"}
                    width={image.width}
                    height={image.height}
                    priority
                    onClick={() => onImageClick(index)}
                  />
                  <div className={styles.imageDetails}>
                    <ImageDetails
                      title={image.title}
                      description={image.description || ""}
                      dimensions={image.dimensions}
                      price={image.price}
                      isExpanded={isExpanded}
                      toggleDescription={() => toggleDescription(index)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      {showPagination && (
        <div className={styles.paginationControls}>
          <div className={styles.buttonContainer}>
            {page > 1 && (
              <button
                onClick={prevPage}
                disabled={page === 1}
                className={styles.arrowButton}
                aria-label="Previous Page"
              >
                &#8592;
              </button>
            )}
          </div>
          <span className={styles.pageNumber}>Page {page}</span>
          <div className={styles.buttonContainer}>
            {hasMore && (
              <button
                onClick={nextPage}
                className={styles.arrowButton}
                aria-label="Next Page"
              >
                &#8594;
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;