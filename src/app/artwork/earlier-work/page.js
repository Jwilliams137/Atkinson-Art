"use client";
import React from "react";
import usePageImages from "../../../hooks/usePageImages";
import useTextUploads from "../../../hooks/useTextUploads";
import useModal from "../../../hooks/useModal";
import ImageGallery from "../../../components/ImageGallery/ImageGallery";
import Modal from "../../../components/Modal/Modal";
import TextSection from "../../../components/TextSection/TextSection";
import styles from "./page.module.css";

const EarlierWorkPage = () => {
  const images = usePageImages("earlier-work");
  const textUploads = useTextUploads("earlier-work");
  const { isModalOpen, currentImageIndex, openModal, closeModal, shouldRenderModal } = useModal();

  return (
    <div>
      <div className={styles.earlierWorkContainer}>
        <ImageGallery
          images={images}
          className={styles.earlierWorkGallery}
          cardClass={styles.earlierWorkGalleryCard}
          imageClass={styles.earlierWorkGalleryImage}
          onImageClick={openModal}
          mobileLabelClass={styles.earlierWorkMobileLabel}
          mobileTitleClass={styles.earlierWorkMobileTitle}
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
          containerClass={styles.earlierWorkTextContainer}
          sectionClass={styles.earlierWorkTextSection}
          textClass={styles.earlierWorkTextClass}
        />
      </div>
    </div>
  );
};

export default EarlierWorkPage;