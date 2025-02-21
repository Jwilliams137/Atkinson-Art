"use client";
import usePageImages from "../../../hooks/usePageImages";
import ImageGallery from "../../../components/ImageGallery/ImageGallery";
import styles from "./page.module.css";

const ConstructionsPage = () => {
  const bioImages = usePageImages("constructions");

  return (
    <div className={styles.bioContainer}>
      <ImageGallery images={bioImages} className={styles.constructionsGallery} />
    </div>
  );
};

export default ConstructionsPage;