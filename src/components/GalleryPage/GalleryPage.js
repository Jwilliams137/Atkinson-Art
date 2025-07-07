"use client";
import usePageImages from "../../hooks/usePageImages";
import useTextUploads from "../../hooks/useTextUploads";
import useModal from "../../hooks/useModal";
import ImageGallery from "../ImageGallery/ImageGallery";
import Modal from "../Modal/Modal";
import TextSection from "../TextSection/TextSection";
import ComingSoon from "../ComingSoon/ComingSoon";
import styles from "./GalleryPage.module.css";

const GalleryPage = ({ collectionName, heading }) => {
  const { images, nextPage, prevPage, page, hasMore } = usePageImages(collectionName);
  const textUploads = useTextUploads(collectionName);
  const { isModalOpen, currentImageIndex, openModal, closeModal, shouldRenderModal } = useModal();
  const hasImages = images && images.length > 0;

  const processedImages = images.map((image) => {
    if (Array.isArray(image.imageUrls)) {
      const sorted = [...image.imageUrls]
        .filter((img) => img?.url)
        .sort((a, b) => {
          const orderA = a.detailOrder ?? 999;
          const orderB = b.detailOrder ?? 999;
          return orderA - orderB;
        });

      const bestImage = sorted.find((img) => img.detailOrder === 0) || sorted[0] || null;

      return {
        ...image,
        displayImage: bestImage,
      };
    } else if (image.imageUrl) {
      return {
        ...image,
        displayImage: {
          url: image.imageUrl,
          width: image.width,
          height: image.height,
        },
      };
    }

    return { ...image, displayImage: null };
  });

  return (
    <div className={styles.page}>
      {heading && <h1 className={styles.visuallyHidden}>{heading}</h1>}
      {hasImages ? (
        <div className={styles.container}>
          <div className={styles.imageWrapper}>
            <ImageGallery
              images={processedImages}
              onImageClick={openModal}
              nextPage={nextPage}
              prevPage={prevPage}
              page={page}
              hasMore={hasMore}
              itemsPerPage={20}
            />
          </div>
          {isModalOpen && shouldRenderModal && (
            <Modal
              images={processedImages}
              currentImageIndex={currentImageIndex}
              closeModal={closeModal}
            />
          )}
        </div>
      ) : (
        <ComingSoon collectionName={collectionName} />
      )}
      <div className={styles.text}>
        <TextSection textUploads={textUploads} />
      </div>
    </div>
  );
};

export default GalleryPage;