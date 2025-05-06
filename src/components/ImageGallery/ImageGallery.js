"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./ImageGallery.module.css";

const ImageGallery = ({
  images,
  onImageClick = () => {},
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

  const truncate = (text, limit) => {
    if (text.length <= limit) return text;
    return text.substring(0, limit) + "...";
  };

  return (
    <div className={styles.gallery}>
      <div className={styles.galleryContainer}>
        {images.length > 0 &&
          images.map((image, index) => {
            const isExpanded = expandedDescriptions[index];
            const description = image.description || "";

            return (
              <div key={image.id || index} className={styles.galleryCard}>
                <div className={styles.imageWrapper}>
                  <Image
                    className={styles.galleryImage}
                    src={image.imageUrl}
                    alt={image.title || "Gallery Image"}
                    width={image.width}
                    height={image.height}
                    priority
                    onClick={() => onImageClick(index)}
                  />
                  <div className={styles.mobileLabel}>
                    <p className={styles.mobileTitle}>{image.title}</p>
                    {description && (
                      <p>
                        {isExpanded ? description : truncate(description, 40)}
                        {description.length > 40 && (
                          <button
                            onClick={() => toggleDescription(index)}
                            className={styles.readMoreToggle}
                          >
                            {isExpanded ? " Read less" : " Read more"}
                          </button>
                        )}
                      </p>
                    )}
                    {image.dimensions && <p>{image.dimensions}</p>}
                    {image.price !== "" && <p>{image.price}</p>}
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