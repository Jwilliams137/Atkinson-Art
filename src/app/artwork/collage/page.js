"use client";
import React from "react";
import usePageImages from "../../../hooks/usePageImages";
import useTextUploads from "../../../hooks/useTextUploads";
import useModal from "../../../hooks/useModal";
import ImageGallery from "../../../components/ImageGallery/ImageGallery";
import Modal from "../../../components/Modal/Modal";
import TextSection from "../../../components/TextSection/TextSection";
import styles from "./page.module.css";

const CollagePage = () => {
  const { images, nextPage, prevPage, page, hasMore } = usePageImages("collage");
  const textUploads = useTextUploads("collage");
  const { isModalOpen, currentImageIndex, openModal, closeModal, shouldRenderModal } = useModal();

  return (
    <div>
      <div className={styles.collageContainer}>
        <ImageGallery
          images={images}
          className={styles.collageGallery}
          cardClass={styles.collageGalleryCard}
          imageClass={styles.collageGalleryImage}
          onImageClick={openModal}
          mobileLabelClass={styles.collageMobileLabel}
          mobileTitleClass={styles.collageMobileTitle}
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
          containerClass={styles.collageTextContainer}
          sectionClass={styles.collageTextSection}
          textClass={styles.collageTextClass}
        />
      </div>
    </div>
  );
};

export default CollagePage;