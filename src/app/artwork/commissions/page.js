"use client";
import usePageImages from "../../../hooks/usePageImages";
import useTextUploads from "../../../hooks/useTextUploads";
import useModal from "../../../hooks/useModal";
import ImageGallery from "../../../components/ImageGallery/ImageGallery";
import Modal from "../../../components/Modal/Modal";
import TextSection from "../../../components/TextSection/TextSection";
import styles from "./page.module.css";

const CommissionsPage = () => {
  const { images, nextPage, prevPage, page, hasMore } = usePageImages("commissions");
  const textUploads = useTextUploads("commissions");
  const { isModalOpen, currentImageIndex, openModal, closeModal, shouldRenderModal } = useModal();

  return (
    <div className={styles.commissionsPage}>
      {images.length > 0 && (
        <div className={styles.commissionsContainer}>
          <ImageGallery
            images={images}
            className={styles.commissionsGallery}
            cardClass={styles.commissionsGalleryCard}
            imageClass={styles.commissionsGalleryImage}
            onImageClick={openModal}
            mobileLabelClass={styles.commissionsMobileLabel}
            mobileTitleClass={styles.commissionsMobileTitle}
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
          containerClass={styles.commissionsTextContainer}
          sectionClass={styles.commissionsTextSection}
          textClass={styles.commissionsTextClass}
        />
      </div>
    </div>
  );
};

export default CommissionsPage;