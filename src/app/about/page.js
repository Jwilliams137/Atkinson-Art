"use client";
import React from 'react';
import usePageImages from "../../hooks/usePageImages";
import ImageGallery from "../../components/ImageGallery/ImageGallery";
import styles from "./page.module.css";
import TextSection from '../../components/TextSection/TextSection';
import useTextUploads from '../../hooks/useTextUploads';

const AboutPage = () => {
  const textUploads = useTextUploads("about")
  const images = usePageImages("about");

    return (
    <div className={styles.aboutContainer}>
      <TextSection
        textUploads={textUploads}
        containerClass={styles.earlierWorkTextContainer}
        sectionClass={styles.earlierWorkTextSection}
        textClass={styles.earlierWorkTextClass}
      />
      <ImageGallery
        images={images}
        className={styles.aboutGallery}
        cardClass={styles.aboutGalleryCard}
        imageClass={styles.aboutGalleryImage}
        mobileLabelClass={styles.aboutMobileLabel}
        mobileTitleClass={styles.aboutMobileTitle}
      />
    </div>
  );
};

export default AboutPage;