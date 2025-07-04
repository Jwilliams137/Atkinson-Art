"use client";
import usePageImages from "../../hooks/usePageImages";
import useTextUploads from "../../hooks/useTextUploads";
import TextSection from "../TextSection/TextSection";
import useModal from "../../hooks/useModal";
import ImageGallery from "../ImageGallery/ImageGallery";
import TestModal from "../TestModal/TestModal";
import styles from './TestGalleryPage.module.css';

const TestGalleryPage = ({ collectionName }) => {
  const { images, nextPage, prevPage, page, hasMore } = usePageImages(collectionName);
  const textUploads = useTextUploads(collectionName);
  const { isModalOpen, currentImageIndex, openModal, closeModal, shouldRenderModal } = useModal();

  return (
    <div className={styles.page}>
      {images?.length > 0 ? (
        <div className={styles.container}>
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
            <TestModal
              images={images}
              currentImageIndex={currentImageIndex}
              closeModal={closeModal}
            />
          )}
        </div>
      ) : (
        <div className={styles.emptyMessage}>
          {images ? "No images found." : "Loading..."}
        </div>
      )}

      <div className={styles.text}>
        <TextSection textUploads={textUploads} />
      </div>
    </div>
  );
};

export default TestGalleryPage;