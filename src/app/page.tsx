'use client'
import React from 'react';
import usePageImages from "../hooks/usePageImages";
import ImageGallery from "../components/ImageGallery/ImageGallery";
import useTextUploads from "../hooks/useTextUploads";
import TextSection from "../components/TextSection/TextSection";
import styles from "./page.module.css";

const HomePage = () => {
  const homeImages = usePageImages("home");
  const homeTextUploads = useTextUploads("home");

  return (
    <div className={styles.homeContainer}>
      <ImageGallery
        images={homeImages}
        className={styles.homeGallery}
        cardClass={styles.homeGalleryCard}
        imageClass={styles.homeGalleryImage}
        mobileLabelClass={styles.homeMobileLabel}
        mobileTitleClass={styles.homeMobileTitle}
      />
      <div className={styles.text}>
        <TextSection textUploads={homeTextUploads}
          containerClass={styles.homeTextContainer}
          sectionClass={styles.homeTextSection}
          textClass={styles.homeText} />
      </div>
    </div>
  );
};

export default HomePage;