"use client";
import usePageImages from "../../hooks/usePageImages";
import ImageGallery from "../../components/ImageGallery/ImageGallery";
import styles from "./page.module.css";

const ArtworkPage = () => {
  const bioImages = usePageImages("artwork");

  return (
    <div className={styles.bioContainer}>
      <ImageGallery images={bioImages} className={styles.artworkGallery} />
    </div>
  );
};

export default ArtworkPage;
