"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import styles from "./page.module.css";
import ImageDetails from "@/components/ImageDetails/ImageDetails";
import TextSection from "@/components/TextSection/TextSection";
import usePageImages from "@/hooks/usePageImages";
import useTextUploads from "@/hooks/useTextUploads";
import useModal from "@/hooks/useModal";

const Modal = dynamic(() => import("@/components/Modal/Modal"), {
  loading: () => null,
});

interface ImageData {
  id?: string;
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
}

const fixCloudinaryUrl = (url: string): string => {
  if (!url) return url;
  if (!url.includes("/upload/")) return url;
  const parts = url.split("/upload/");
  const transforms = parts[1].startsWith("a_") || parts[1].match(/^[a-z]/i)
    ? parts[1]
    : `a_exif,f_auto,q_auto/${parts[1]}`;

  const ensured = transforms.includes("a_exif") || transforms.includes("f_auto") || transforms.includes("q_auto")
    ? `a_exif,f_auto,q_auto/${transforms.replace(/^([^/])/, "$1")}`
    : `a_exif,f_auto,q_auto/${transforms}`;

  return `${parts[0]}/upload/${ensured}`;
};

const HomePage = () => {
  const {
    images,
    nextPage,
    prevPage,
    page,
    hasMore,
  }: {
    images: ImageData[];
    nextPage: () => void;
    prevPage: () => void;
    page: number;
    hasMore: boolean;
  } = usePageImages("home");

  const homeTextUploads = useTextUploads("home");
  const { isModalOpen, currentImageIndex, openModal, closeModal, shouldRenderModal } = useModal();

  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<number, boolean>>({});
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [selectedMobileImages, setSelectedMobileImages] = useState<Record<number, {
    url: string;
    width: number;
    height: number;
    detailOrder?: number;
  }>>({});

  useEffect(() => {
    const updateIsMobile = () => setIsMobile(window.innerWidth < 1000);
    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  const itemsPerPage = 20;
  const showPagination = page > 1 || (hasMore && images.length === itemsPerPage);

  const toggleDescription = (index: number) => {
    setExpandedDescriptions(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.visuallyHidden}>Linda Atkinson – Mixed Media Artist</h1>

      <div className={styles.galleryContainer}>
        <div className={styles.gallery}>
          {images.map((image, index) => {
            const isExpanded = expandedDescriptions[index];
            const imageSet = Array.isArray(image.imageUrls)
              ? [...image.imageUrls]
                  .filter((img) => img?.url)
                  .sort((a, b) => (a.detailOrder ?? 999) - (b.detailOrder ?? 999))
              : [];

            const fallbackImage =
              imageSet[0] ||
              (image.imageUrl
                ? {
                    url: image.imageUrl,
                    width: image.width || 600,
                    height: image.height || 400,
                  }
                : null);

            const displayImage = isMobile
              ? selectedMobileImages[index] || fallbackImage
              : fallbackImage;

            const src = displayImage?.url ? fixCloudinaryUrl(displayImage.url) : undefined;
            const width = displayImage?.width || 600;
            const height = displayImage?.height || 400;
            const isHero = index === 0;

            return (
              <div key={image.id || index} className={styles.galleryCard}>
                <div className={styles.imageWrapper}>
                  {src ? (
                    <Image
                      className={styles.image}
                      src={src}
                      alt={image.title || "Gallery Image"}
                      width={width}
                      height={height}
                      priority={isHero}
                      fetchPriority={isHero ? "high" : "auto"}
                      loading={isHero ? undefined : "lazy"}
                      decoding={isHero ? "sync" : "async"}
                      sizes="(max-width: 1000px) 100vw, 600px"
                      onClick={() => !isMobile && openModal(index)}
                    />
                  ) : (
                    <div className={styles.imagePlaceholder}>No image available</div>
                  )}

                  {isMobile && imageSet.length > 1 && (
                    <div className={styles.mobileThumbnails}>
                      {imageSet.map((thumb, thumbIndex) => (
                        <Image
                          key={thumb.url + thumbIndex}
                          src={fixCloudinaryUrl(thumb.url)}
                          alt={`Thumbnail ${thumbIndex + 1}`}
                          width={60}
                          height={60}
                          className={`${styles.thumbnail} ${
                            selectedMobileImages[index]?.url === thumb.url ? styles.activeThumbnail : ""
                          }`}
                          loading="lazy"
                          fetchPriority="low"
                          decoding="async"
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
          <Modal images={images} currentImageIndex={currentImageIndex} closeModal={closeModal} />
        )}
      </div>

      <div className={styles.textSection}>
        <TextSection textUploads={homeTextUploads} />
      </div>
    </div>
  );
};

export default HomePage;