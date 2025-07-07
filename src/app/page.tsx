"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import ImageDetails from "@/components/ImageDetails/ImageDetails";
import TextSection from "@/components/TextSection/TextSection";
import usePageImages from "@/hooks/usePageImages";
import useTextUploads from "@/hooks/useTextUploads";
import useModal from "@/hooks/useModal";
import Modal from "@/components/Modal/Modal";

const HomePage = () => {
  const { images, nextPage, prevPage, page, hasMore } = usePageImages("home") as {
    images: {
      id: string;
      imageUrl?: string;
      imageUrls?: {
        url: string;
        width: number;
        height: number;
        detailOrder?: number;
      }[];
      title?: string;
      description?: string;
      width?: number;
      height?: number;
      dimensions?: string;
      price?: string;
    }[];
    nextPage: () => void;
    prevPage: () => void;
    page: number;
    hasMore: boolean;
  };

  const homeTextUploads = useTextUploads("home");
  const { isModalOpen, currentImageIndex, openModal, closeModal, shouldRenderModal } = useModal();

  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<number, boolean>>({});
  const itemsPerPage = 20;

  const toggleDescription = (index: number) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const showPagination = page > 1 || (hasMore && images.length === itemsPerPage);

  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.visuallyHidden}>Linda Atkinson – Mixed Media Artist</h1>
      <div className={styles.galleryContainer}>
        <div className={styles.gallery}>
          {images.map((image, index) => {
            const isExpanded = expandedDescriptions[index];

            const displayImage = (() => {
              if (Array.isArray(image.imageUrls)) {
                const fallback = image.imageUrls
                  .slice()
                  .sort((a, b) => (a.detailOrder ?? 0) - (b.detailOrder ?? 0))
                  .find((img) => img?.url);
                return fallback || null;
              }

              if (image.imageUrl) {
                return {
                  url: image.imageUrl,
                  width: image.width,
                  height: image.height,
                };
              }

              return null;
            })();

            return (
              <div key={image.id || index} className={styles.galleryCard}>
                <div className={styles.imageWrapper}>
                  {displayImage ? (
                    <Image
                      className={styles.image}
                      src={displayImage.url}
                      alt={image.title || "Gallery Image"}
                      width={displayImage.width || 600}
                      height={displayImage.height || 400}
                      priority
                      onClick={() => openModal(index)}
                    />
                  ) : (
                    <div className={styles.imagePlaceholder}>No image available</div>
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

        {isModalOpen && shouldRenderModal && (
          <Modal
            images={images}
            currentImageIndex={currentImageIndex}
            closeModal={closeModal}
          />
        )}
      </div>

      <div className={styles.textSection}>
        <TextSection textUploads={homeTextUploads} />
      </div>
    </div>
  );
};

export default HomePage;