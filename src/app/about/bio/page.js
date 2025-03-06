"use client";
import React from 'react';
import useTextUploads from '../../../hooks/useTextUploads';
import TextSection from '../../../components/TextSection/TextSection';
import usePageImages from "../../../hooks/usePageImages";
import ImageGallery from "../../../components/ImageGallery/ImageGallery";
import styles from "./page.module.css";

const BioPage = () => {
  const textUploads = useTextUploads('bio')
  const images = usePageImages("bio");

  return (
    <div className={styles.bioContainer}>
      <h2>Biography</h2>
      <TextSection
        textUploads={textUploads}
        containerClass={styles.bioTextContainer}
        sectionClass={styles.bioTextSection}
        textClass={styles.bioTextClass}
      />
      <ImageGallery
        images={images}
        className={styles.bioGallery}
        cardClass={styles.bioGalleryCard}
        imageClass={styles.bioGalleryImage}
        mobileLabelClass={styles.bioMobileLabel}
        mobileTitleClass={styles.bioMobileTitle}
         />
    </div>
  );
};

export default BioPage;