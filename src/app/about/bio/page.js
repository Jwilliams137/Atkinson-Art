"use client";
import usePageImages from "../../../hooks/usePageImages";
import ImageGallery from "../../../components/ImageGallery/ImageGallery";
import styles from "./page.module.css";

const BioPage = () => {
  const bioImages = usePageImages("bio");

  return (
    <div className={styles.bioContainer}>
      <ImageGallery images={bioImages} className={styles.bioGallery} />
    </div>
  );
};

export default BioPage;