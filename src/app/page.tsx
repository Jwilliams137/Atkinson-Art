"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import ImageDetails from "@/components/ImageDetails/ImageDetails";
import TextSection from "@/components/TextSection/TextSection";
import usePageImages from "@/hooks/usePageImages";
import useTextUploads from "@/hooks/useTextUploads";

const HomePage = () => {
  const { images, nextPage, prevPage, page, hasMore } = usePageImages("home") as {
    images: {
      id: string;
      imageUrl: string;
      title?: string;
      description?: string;
      width: number;
      height: number;
      dimensions?: string;
      price?: string;
    }[];
    nextPage: () => void;
    prevPage: () => void;
    page: number;
    hasMore: boolean;
  };

  const homeTextUploads = useTextUploads("home");
  const itemsPerPage = 20;

  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<number, boolean>>({});


  const toggleDescription = (index: number) => {

    setExpandedDescriptions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const showPagination =
    page > 1 || (hasMore && images.length === itemsPerPage);

  return (
    <div className={styles.homeContainer}>
      <div className={styles.galleryContainer}>
        <div className={styles.gallery}>
          {images.map((image, index) => {
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
                    onClick={() => toggleDescription(index)}
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
      <div className={styles.textSection}>
        <TextSection
          textUploads={homeTextUploads}
        />
      </div>
    </div>
  );
};

export default HomePage;
