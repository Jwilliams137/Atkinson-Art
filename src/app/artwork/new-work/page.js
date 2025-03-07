"use client";
import React from "react";
import usePageImages from "../../../hooks/usePageImages";
import useTextUploads from "../../../hooks/useTextUploads";
import useModal from "../../../hooks/useModal";
import ImageGallery from "../../../components/ImageGallery/ImageGallery";
import Modal from "../../../components/Modal/Modal";
import TextSection from "../../../components/TextSection/TextSection";
import styles from "./page.module.css";

const NewWorkPage = () => {
  const { images, nextPage, prevPage, page, hasMore } = usePageImages("new-work");
  const textUploads = useTextUploads("new-work");
  const { isModalOpen, currentImageIndex, openModal, closeModal, shouldRenderModal } = useModal();

  return (
    <div>
      <div className={styles.newWorkContainer}>
        <ImageGallery
          images={images}
          className={styles.newWorkGallery}
          cardClass={styles.newWorkGalleryCard}
          imageClass={styles.newWorkGalleryImage}
          onImageClick={openModal}
          mobileLabelClass={styles.newWorkMobileLabel}
          mobileTitleClass={styles.newWorkMobileTitle}
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
      <div className={styles.text}>
        <TextSection
          textUploads={textUploads}
          containerClass={styles.newWorkTextContainer}
          sectionClass={styles.newWorkTextSection}
          textClass={styles.newWorkTextClass}
        />
      </div>
    </div>
  );
};

export default NewWorkPage;