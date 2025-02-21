"use client";
import usePageImages from "../../../hooks/usePageImages";
import ImageGallery from "../../../components/ImageGallery/ImageGallery";
import styles from "./page.module.css";

const EarlierWorkPage = () => {
  const bioImages = usePageImages("earlier-work");

  return (
    <div className={styles.bioContainer}>
      <ImageGallery images={bioImages} className={styles.earlierWorkGallery} />
    </div>
  );
};

export default EarlierWorkPage;