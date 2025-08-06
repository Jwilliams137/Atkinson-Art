"use client";
import usePageImages from "../../hooks/usePageImages";
import useTextUploads from "../../hooks/useTextUploads";
import useModal from "../../hooks/useModal";
import ImageGallery from "../../components/ImageGallery/ImageGallery";
import Modal from "../../components/Modal/Modal";
import TextSection from "../../components/TextSection/TextSection";
import styles from "./page.module.css";

const ShopPage = () => {
  const { images, nextPage, prevPage, page, hasMore } = usePageImages("shop");
  const textUploads = useTextUploads("shop");
  const { isModalOpen, currentImageIndex, openModal, closeModal, shouldRenderModal } = useModal();

  const normalizedImages = images
    .map((item) => {
      let displayImage = null;

      if (Array.isArray(item.imageUrls) && item.imageUrls.length > 0) {
        const sorted = [...item.imageUrls].sort((a, b) => {
          const orderA = a.detailOrder ?? 999;
          const orderB = b.detailOrder ?? 999;
          return orderA - orderB;
        });

        displayImage = sorted.find((img) => img.detailOrder === 0 && img.url) || sorted.find((img) => img.url);
      } else if (item.imageUrl) {
        displayImage = {
          url: item.imageUrl,
          width: item.width,
          height: item.height,
        };
      }

      if (!displayImage || !displayImage.url) return null;

      return {
        ...item,
        displayImage,
        imageUrls: item.imageUrls || [],
      };
    })
    .filter(Boolean);

  return (
    <div className={styles.shopPage}>
      <h1 className={styles.visuallyHidden}>
        Artwork available for purchase by Linda Atkinson
      </h1>

      {normalizedImages.length > 0 && (
        <div className={styles.shopContainer}>
          <div className={styles.imageWrapper}>
            <ImageGallery
              images={normalizedImages}
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
              images={normalizedImages}
              currentImageIndex={currentImageIndex}
              closeModal={closeModal}
            />
          )}
        </div>
      )}

      <div className={styles.text}>
        <TextSection textUploads={textUploads} />
      </div>
    </div>
  );
};

export default ShopPage;