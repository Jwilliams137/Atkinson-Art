"use client";
import usePageImages from "../../../hooks/usePageImages";
import useTextUploads from "../../../hooks/useTextUploads";
import useModal from "../../../hooks/useModal";
import ImageGallery from "../../../components/ImageGallery/ImageGallery";
import Modal from "../../../components/Modal/Modal";
import TextSection from "../../../components/TextSection/TextSection";
import styles from "./page.module.css";

const HousesPage = () => {
  const { images, nextPage, prevPage, page, hasMore } = usePageImages("houses");
  const textUploads = useTextUploads("houses");
  const { isModalOpen, currentImageIndex, openModal, closeModal, shouldRenderModal } = useModal();

  return (
    <div className={styles.housesPage}>
      {images.length > 0 && (
        <div className={styles.housesContainer}>
          <ImageGallery
            images={images}
            className={styles.housesGallery}
            cardClass={styles.housesGalleryCard}
            imageClass={styles.housesGalleryImage}
            onImageClick={openModal}
            mobileLabelClass={styles.housesMobileLabel}
            mobileTitleClass={styles.housesMobileTitle}
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
          containerClass={styles.housesTextContainer}
          sectionClass={styles.housesTextSection}
          textClass={styles.housesTextClass}
        />
      </div>
    </div>
  );
};

export default HousesPage;