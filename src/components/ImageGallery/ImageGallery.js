"use client";
import { cld } from "@/utils/cdn";
import { useEffect, useState } from "react";
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
  const [isMobile, setIsMobile] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [selectedMobileImages, setSelectedMobileImages] = useState({});

  useEffect(() => {
    const updateIsMobile = () => {
      setIsMobile(window.innerWidth < 1000);
    };

    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  const toggleDescription = (index) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const showPagination = page > 1 || (hasMore && images.length === itemsPerPage);

  return (
    <div className={styles.galleryContainer}>
      <div className={styles.gallery}>
        {images.map((image, index) => {
          const isExpanded = expandedDescriptions[index];
          const imageSet = Array.isArray(image.imageUrls)
            ? [...image.imageUrls].filter((img) => img?.url).sort((a, b) => (a.detailOrder ?? 999) - (b.detailOrder ?? 999))
            : [];

          const currentImage = isMobile
            ? selectedMobileImages[index] || imageSet[0] || image.displayImage
            : image.displayImage;

          return (
            <div key={image.id || index} className={styles.galleryCard}>
              <div className={styles.imageWrapper}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => !isMobile && onImageClick(index)}
                  onKeyDown={(e) => {
                    if ((e.key === "Enter" || e.key === " ") && !isMobile) {
                      e.preventDefault();
                      onImageClick(index);
                    }
                  }}
                  aria-label={`Open modal for ${image.title || "artwork"}`}
                  className={styles.imageWrapper}
                >
                  {currentImage?.url ? (
                    <Image
                      className={styles.image}
                      src={cld(currentImage.url, { width: 1000 })}
                      unoptimized
                      alt={image.title || "Gallery Image"}
                      width={currentImage.width || 300}
                      height={currentImage.height || 200}
                      priority
                    />
                  ) : (
                    <div className={styles.imagePlaceholder}>No image</div>
                  )}
                </div>

                {isMobile && imageSet.length > 1 && (
                  <div className={styles.mobileThumbnails}>
                    {imageSet.map((thumb, thumbIndex) => (
                      <Image
                        key={thumb.url + thumbIndex}
                        src={cld(thumb.url, { width: 120 })}
                        unoptimized
                        alt={`Thumbnail ${thumbIndex + 1}`}
                        width={60}
                        height={60}
                        className={`${styles.thumbnail} ${selectedMobileImages[index]?.url === thumb.url ? styles.activeThumbnail : ""
                          }`}
                        onClick={() =>
                          setSelectedMobileImages((prev) => ({ ...prev, [index]: thumb }))
                        }
                      />
                    ))}
                  </div>
                )}

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