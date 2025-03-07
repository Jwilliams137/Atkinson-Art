"use client";
import React from "react";
import usePageImages from "../../hooks/usePageImages";
import useTextUploads from "../../hooks/useTextUploads";
import useModal from "../../hooks/useModal";
import ImageGallery from "../../components/ImageGallery/ImageGallery";
import Modal from "../../components/Modal/Modal";
import TextSection from "../../components/TextSection/TextSection";
import styles from "./page.module.css";

const ShopPage = () => {
  const { images, nextPage, prevPage, page, hasMore } = usePageImages("shop");
  const textUploads = useTextUploads("shop");
  const { isModalOpen, currentImageIndex, openModal, closeModal, shouldRenderModal } = useModal();

  return (
    <div className={styles.shopPage}>
      <div className={styles.shopContainer}>
        <ImageGallery
          images={images}
          className={styles.shopGallery}
          cardClass={styles.shopGalleryCard}
          imageClass={styles.shopGalleryImage}
          onImageClick={openModal}
          mobileLabelClass={styles.shopMobileLabel}
          mobileTitleClass={styles.shopMobileTitle}
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
      <div className={styles.text}><TextSection textUploads={textUploads} containerClass={styles.shopTextContainer}
        sectionClass={styles.shopTextSection}
        textClass={styles.shopTextClass} /></div>
    </div>
  );
};

export default ShopPage;