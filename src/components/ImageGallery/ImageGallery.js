"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./ImageGallery.module.css";

const ImageGallery = ({
  images,
  className,
  cardClass,
  imageClass,
  mobileLabelClass,
  mobileTitleClass,
  onImageClick = () => {},
  nextPage,
  prevPage,
  page,
  hasMore,
  itemsPerPage,
}) => {
  const showPagination =
    page > 1 || (hasMore && images.length === itemsPerPage);

  // Track toggle state per image
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
      <div className={`${styles.galleryContainer} ${className}`}>
        {images.length > 0 &&
          images.map((image, index) => {
            const isExpanded = expandedDescriptions[index];
            const description = image.description || "";

            return (
              <div key={image.id || index} className={cardClass || styles.galleryCard}>
                <div className={styles.imageWrapper}>
                  <Image
                    className={imageClass || styles.galleryImage}
                    src={image.imageUrl}
                    alt={image.title || "Gallery Image"}
                    width={image.width}
                    height={image.height}
                    priority
                    onClick={() => onImageClick(index)}
                  />
                </div>
                <div className={`${styles.mobileLabel} ${mobileLabelClass}`}>
                  <p className={`${styles.mobileTitle} ${mobileTitleClass}`}>
                    {image.title}
                  </p>
                  {description && (
                    <>
                      <p>
                        {isExpanded ? description : truncate(description, 65)}
                        {description.length > 65 && (
                          <button
                            onClick={() => toggleDescription(index)}
                            className={styles.readMoreToggle}
                          >
                            {isExpanded ? " Read less" : " Read more"}
                          </button>
                        )}
                      </p>
                    </>
                  )}
                  {image.dimensions && <p>{image.dimensions}</p>}
                  {image.price !== "" && <p>{image.price}</p>}
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