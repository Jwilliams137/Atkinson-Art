"use client";
import usePageImages from "../../../hooks/usePageImages";
import ImageGallery from "../../../components/ImageGallery/ImageGallery";
import styles from "./page.module.css";

const CollagePage = () => {
  const bioImages = usePageImages("collage");

  return (
    <div className={styles.bioContainer}>
      <ImageGallery images={bioImages} className={styles.collageGallery} />
    </div>
  );
};

export default CollagePage;