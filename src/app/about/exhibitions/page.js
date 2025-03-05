"use client";
import React from "react";
import usePageImages from "../../../hooks/usePageImages";
import useTextUploads from "../../../hooks/useTextUploads";
import ImageGallery from "../../../components/ImageGallery/ImageGallery";
import TextSection from "../../../components/TextSection/TextSection";
import styles from "./page.module.css";

const ExhibitionsPage = () => {
  const images = usePageImages("exhibitions");
  const textUploads = useTextUploads("exhibitions");

  return (
    <div>
      <div className={styles.text}><TextSection textUploads={textUploads} containerClass={styles.exhibitionsTextContainer}
        sectionClass={styles.exhibitionsTextSection}
        textClass={styles.exhibitionsTextClass} />
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