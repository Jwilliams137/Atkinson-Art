"use client";
import usePageImages from "../../hooks/usePageImages";
import useTextUploads from "../../hooks/useTextUploads";
import useModal from "../../hooks/useModal";
import ImageGallery from "../ImageGallery/ImageGallery";
import Modal from "../Modal/Modal";
import TextSection from "../TextSection/TextSection";
import styles from './GalleryPage.module.css'

const GalleryPage = ({ collectionName }) => {
  const { images, nextPage, prevPage, page, hasMore } = usePageImages(collectionName);
  const textUploads = useTextUploads(collectionName);
  const { isModalOpen, currentImageIndex, openModal, closeModal, shouldRenderModal } = useModal();

  return (
    <div className={styles.page}>
      {images.length > 0 && (
        <div className={styles.container}>
          <ImageGallery
            images={images}
            className={styles.gallery}
            cardClass={styles.galleryCard}
            imageClass={styles.galleryImage}
            onImageClick={openModal}
            mobileLabelClass={styles.mobileLabel}
            mobileTitleClass={styles.mobileTitle}
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
          containerClass={styles.textContainer}
          sectionClass={styles.textSection}
          textClass={styles.textClass}
        />
      </div>
    </div>
  );
};

export default GalleryPage;