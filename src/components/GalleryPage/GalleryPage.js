"use client";
import usePageImages from "../../hooks/usePageImages";
import useTextUploads from "../../hooks/useTextUploads";
import useModal from "../../hooks/useModal";
import ImageGallery from "../ImageGallery/ImageGallery";
import Modal from "../Modal/Modal";
import TextSection from "../TextSection/TextSection";
import ComingSoon from "../ComingSoon/ComingSoon";
import styles from './GalleryPage.module.css';

const GalleryPage = ({ collectionName, heading }) => {
  const { images, nextPage, prevPage, page, hasMore } = usePageImages(collectionName);
  const textUploads = useTextUploads(collectionName);
  const { isModalOpen, currentImageIndex, openModal, closeModal, shouldRenderModal } = useModal();
  const hasImages = images && images.length > 0;

  return (
    <div className={styles.page}>
      {heading && <h1 className={styles.visuallyHidden}>{heading}</h1>}
      {hasImages ? (
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
            <Modal
              images={images}
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