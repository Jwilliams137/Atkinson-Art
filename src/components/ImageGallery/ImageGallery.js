import React from "react";
import Image from "next/image";
import styles from "./ImageGallery.module.css";

const ImageGallery = ({
  images,
  className,
  cardClass,
  imageClass,
  mobileLabelClass,
  mobileTitleClass,
  onImageClick = () => { },
  nextPage,
  prevPage,
  page,
  hasMore
}) => {
  return (
    <div>
      <div className={`${styles.galleryContainer} ${className}`}>
        {images.length > 0 && (
          images.map((image, index) => (
            <div key={image.id || index} className={cardClass ? cardClass : styles.galleryCard}>
              <div className={styles.imageWrapper}>
                <Image
                  className={imageClass || styles.galleryImage}
                  src={image.imageUrl}
                  alt={image.title || "Gallery Image"}
                  width={image.width || 500}
                  height={image.height || 500}
                  priority
                  onClick={() => onImageClick(index)}
                />
              </div>
              <div className={`${styles.mobileLabel} ${mobileLabelClass}`}>
                <p className={`${styles.mobileTitle} ${mobileTitleClass}`}>{image.title}</p>
                <p>{image.description}</p>
                <p>{image.dimensions}</p>
                <p>{image.price}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      <div className={styles.paginationControls}>
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
        
        <span className={styles.pageNumber}>Page {page}</span>

        {/* Only show "Next" button if there's more data */}
        {hasMore && (
          <button
            onClick={nextPage}
            disabled={!hasMore}
            className={styles.arrowButton}
            aria-label="Next Page"
          >
            &#8594;
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageGallery;