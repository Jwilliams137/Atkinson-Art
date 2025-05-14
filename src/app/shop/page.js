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

  return (
    <div className={styles.shopPage}>
      <h1 className={styles.visuallyHidden}>Artwork available for purchase by Linda Atkinson</h1>
      {images.length > 0 && (
        <div className={styles.shopContainer}>
          <ImageGallery
            images={images}
            onImageClick={openModal}
            nextPage={nextPage}
            prevPage={prevPage}
            page={page}
            hasMore={hasMore}
            itemsPerPage={20}
          />
          {isModalOpen && shouldRenderModal && (
            <Modal
              images={images}
              currentImageIndex={currentImageIndex}
              closeModal={closeModal}
            />
          )}
        </div>
      )}
      <div className={styles.text}>
        <TextSection
          textUploads={textUploads}
        />
      </div>
    </div>
  );
};

export default ShopPage;