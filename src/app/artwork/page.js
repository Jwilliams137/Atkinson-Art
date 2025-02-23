'use client'
import usePageImages from "../../hooks/usePageImages";
import ImageGallery from "../../components/ImageGallery/ImageGallery";
import styles from "./page.module.css";

const ArtworkPage = () => {
  const artworkImages = usePageImages("artwork");
  console.log("Artwork Gallery Class:", styles.artworkGallery);

  return (
    <div className={styles.artworkContainer}>
      <ImageGallery
        images={artworkImages}
        className={styles.artworkGallery}
        cardClass={styles.artworkGalleryCard}
        imageClass={styles.artworkGalleryImage}
      />
    </div>
  );
};

export default ArtworkPage;