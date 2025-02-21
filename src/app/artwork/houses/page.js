"use client";
import usePageImages from "../../../hooks/usePageImages";
import ImageGallery from "../../../components/ImageGallery/ImageGallery";
import styles from "./page.module.css";

const HousesPage = () => {
  const bioImages = usePageImages("houses");

  return (
    <div className={styles.bioContainer}>
      <ImageGallery images={bioImages} className={styles.housesGallery} />
    </div>
  );
};

export default HousesPage;
