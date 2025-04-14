"use client";
import usePageImages from "../../../hooks/usePageImages";
import useTextUploads from "../../../hooks/useTextUploads";
import useModal from "../../../hooks/useModal";
import ImageGallery from "../../../components/ImageGallery/ImageGallery";
import Modal from "../../../components/Modal/Modal";
import TextSection from "../../../components/TextSection/TextSection";
import styles from "./page.module.css";

const TinyHousesPage = () => {
  const { images, nextPage, prevPage, page, hasMore } = usePageImages("tiny-houses");
  const textUploads = useTextUploads("tiny-houses");
  const { isModalOpen, currentImageIndex, openModal, closeModal, shouldRenderModal } = useModal();

  return (
    <div className={styles.tinyHousesPage}>
      {images.length > 0 && (
        <div className={styles.tinyHousesContainer}>
          <ImageGallery
            images={images}
            className={styles.tinyHousesGallery}
            cardClass={styles.tinyHousesGalleryCard}
            imageClass={styles.tinyHousesGalleryImage}
            onImageClick={openModal}
            mobileLabelClass={styles.tinyHousesMobileLabel}
            mobileTitleClass={styles.tinyHousesMobileTitle}
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
          containerClass={styles.tinyHousesTextContainer}
          sectionClass={styles.tinyHousesTextSection}
          textClass={styles.tinyHousesTextClass}
        />
      </div>
    </div>
  );
};

export default TinyHousesPage;