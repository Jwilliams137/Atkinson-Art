"use client";
import { cld } from "@/utils/cdn";
import { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import styles from "./page.module.css";
import ImageDetails from "@/components/ImageDetails/ImageDetails";
import TextSection from "@/components/TextSection/TextSection";
import usePageImages from "@/hooks/usePageImages";
import useTextUploads from "@/hooks/useTextUploads";
import useModal from "@/hooks/useModal";

// ---- Minimal inline types so TS is happy ----
type ImageVariant = {
  url: string;
  width: number;
  height: number;
  detailOrder?: number;
};

type ImageData = {
  id?: string;
  imageUrl?: string;
  imageUrls?: ImageVariant[];
  title?: string;
  description?: string;
  width?: number;
  height?: number;
  dimensions?: string;
  price?: string;
};

type UsePageImagesResult = {
  images: ImageData[];
  nextPage: () => void;
  prevPage: () => void;
  page: number;
  hasMore: boolean;
};

type Props = {
  initialImages?: ImageData[];
};

const Modal = dynamic(() => import("@/components/Modal/Modal"), { loading: () => null });

export default function HomeClient({ initialImages = [] }: Props) {
  // Your hook is JS, so TS can’t infer it — give it a shape with a cast:
  const {
    images,
    nextPage,
    prevPage,
    page,
    hasMore,
  } = (usePageImages("home") as unknown) as UsePageImagesResult;

  const homeTextUploads = useTextUploads("home");
  const { isModalOpen, currentImageIndex, openModal, closeModal, shouldRenderModal } = useModal();

  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<number, boolean>>({});
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [selectedMobileImages, setSelectedMobileImages] = useState<
    Record<number, { url: string; width: number; height: number; detailOrder?: number }>
  >({});

  useEffect(() => {
    const updateIsMobile = () => setIsMobile(window.innerWidth < 1000);
    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  const itemsPerPage = 12; // keep this in sync with getInitialHomeImages()
  const imagesToRender: ImageData[] = images.length ? images : initialImages;
  const showPagination = page > 1 || (hasMore && imagesToRender.length === itemsPerPage);

  const toggleDescription = (index: number) => {
    setExpandedDescriptions((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.visuallyHidden}>Linda Atkinson – Mixed Media Artist</h1>

      <div className={styles.galleryContainer}>
        <div className={styles.gallery}>
          {imagesToRender.map((image, index) => {
            const isExpanded = !!expandedDescriptions[index];
            const imageSet: ImageVariant[] = Array.isArray(image.imageUrls)
              ? [...image.imageUrls].filter((img) => !!img?.url)
              : [];

            const fallbackImage =
              imageSet[0] ||
              (image.imageUrl
                ? { url: image.imageUrl, width: image.width || 600, height: image.height || 400 }
                : null);

            const displayImage = isMobile
              ? selectedMobileImages[index] || fallbackImage
              : fallbackImage;

            const src = displayImage?.url;
            const width = displayImage?.width || 600;
            const height = displayImage?.height || 400;
            const isHero = index === 0;

            return (
              <div key={image.id || index} className={styles.galleryCard}>
                <div className={styles.imageWrapper}>
                  {src ? (
                    <Image
                      className={styles.image}
                      src={cld(src, { width: isHero ? 1000 : 600 })}
                      alt={image.title || "Gallery Image"}
                      width={width}
                      height={height}
                      priority={isHero}
                      fetchPriority={isHero ? "high" : "auto"}
                      loading={isHero ? undefined : "lazy"}
                      decoding={isHero ? "sync" : "async"}
                      unoptimized
                      sizes="100vw"
                      style={{ width: "100%", height: "auto" }}
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
                          src={cld(thumb.url, { width: 120 })}
                          alt={`Thumbnail ${thumbIndex + 1}`}
                          width={60}
                          height={60}
                          className={`${styles.thumbnail} ${selectedMobileImages[index]?.url === thumb.url ? styles.activeThumbnail : ""
                            }`}
                          loading="lazy"
                          fetchPriority="low"
                          decoding="async"
                          unoptimized
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
                <button onClick={prevPage} className={styles.arrowButton} aria-label="Previous Page">
                  &#8592;
                </button>
              )}
            </div>
            <span className={styles.pageNumber}>Page {page}</span>
            <div className={styles.buttonContainer}>
              {hasMore && (
                <button onClick={nextPage} className={styles.arrowButton} aria-label="Next Page">
                  &#8594;
                </button>
              )}
            </div>
          </div>
        )}

        {isModalOpen && shouldRenderModal && (
          <Modal images={imagesToRender} currentImageIndex={currentImageIndex} closeModal={closeModal} />
        )}
      </div>

      <div className={styles.textSection}>
        <TextSection textUploads={homeTextUploads} />
      </div>
    </div>
  );
}