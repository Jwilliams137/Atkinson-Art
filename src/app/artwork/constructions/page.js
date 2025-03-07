"use client";
import React from "react";
import usePageImages from "../../../hooks/usePageImages";
import useTextUploads from "../../../hooks/useTextUploads";
import useModal from "../../../hooks/useModal";
import ImageGallery from "../../../components/ImageGallery/ImageGallery";
import Modal from "../../../components/Modal/Modal";
import TextSection from "../../../components/TextSection/TextSection";
import styles from "./page.module.css";

const ConstructionsPage = () => {
  const { images, nextPage, prevPage, page, hasMore } = usePageImages("constructions");
  const textUploads = useTextUploads("constructions");
  const { isModalOpen, currentImageIndex, openModal, closeModal, shouldRenderModal } = useModal();

  return (
    <div>
      <div className={styles.constructionsContainer}>
        <ImageGallery
          images={images}
          className={styles.constructionsGallery}
          cardClass={styles.constructionsGalleryCard}
          imageClass={styles.constructionsGalleryImage}
          onImageClick={openModal}
          mobileLabelClass={styles.constructionsMobileLabel}
          mobileTitleClass={styles.constructionsMobileTitle}
          nextPage={nextPage}
          prevPage={prevPage}
          page={page}
          hasMore={hasMore}
        />
        {isModalOpen && shouldRenderModal && (
          <Modal
            images={images}
            currentImageIndex={currentImageIndex}
            closeModal={closeModal}
          />
        )}
      </div>
      <div className={styles.text}>
        <TextSection
          textUploads={textUploads}
          containerClass={styles.constructionsTextContainer}
          sectionClass={styles.constructionsTextSection}
          textClass={styles.constructionsTextClass}
        />
      </div>
    </div>
  );
};

export default ConstructionsPage;