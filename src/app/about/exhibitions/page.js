"use client";
import React from "react";
import usePageImages from "../../../hooks/usePageImages";
import useTextUploads from "../../../hooks/useTextUploads";
import ImageGallery from "../../../components/ImageGallery/ImageGallery";
import ExhibitionTextSection from '../../../components/ExhibitionTextSection/ExhibitionTextSection'
import styles from "./page.module.css";

const ExhibitionsPage = () => {
  const images = usePageImages("exhibitions");
  const textUploads = useTextUploads("exhibitions");

  return (
    <div>
      <div className={styles.text}>
        <ExhibitionTextSection
        textUploads={textUploads}
        />
      </div>
      <div className={styles.exhibitionsontainer}>
        <ImageGallery
          images={images}
          className={styles.exhibitionsGallery}
          cardClass={styles.exhibitionsGalleryCard}
          imageClass={styles.exhibitionsGalleryImage}
          mobileLabelClass={styles.exhibitionsMobileLabel}
          mobileTitleClass={styles.exhibitionsMobileTitle}
        />
      </div>
    </div>
  );
};

export default ExhibitionsPage;