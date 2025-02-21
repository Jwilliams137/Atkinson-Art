'use client'
import usePageImages from "../hooks/usePageImages";
import ImageGallery from "../components/ImageGallery/ImageGallery";
import styles from "./page.module.css";

const HomePage = () => {
  const homeImages = usePageImages("home");

  return (
    <div className={styles.homeContainer}>
      <ImageGallery
        images={homeImages}
        className={styles.homeGallery}
        cardClass={styles.homeGalleryCard}
        imageClass={styles.homeGalleryImage}
      />
    </div>
  );
};

export default HomePage;