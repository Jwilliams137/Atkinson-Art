'use client'
import usePageImages from "../hooks/usePageImages";
import ImageGallery from "../components/ImageGallery/ImageGallery";
import useTextUploads from "../hooks/useTextUploads";
import TextSection from "../components/TextSection/TextSection";
import styles from "./page.module.css";

const HomePage = () => {
  const { images, nextPage, prevPage, page, hasMore } = usePageImages("home");
  const homeTextUploads = useTextUploads("home");

  return (
    <div className={styles.homeContainer}>
      <ImageGallery
        images={images}
        nextPage={nextPage} 
        prevPage={prevPage} 
        page={page} 
        hasMore={hasMore} 
        itemsPerPage={20}
      />
      <TextSection
        textUploads={homeTextUploads}
        containerClass={styles.homeTextContainer}
        sectionClass={styles.homeTextSection}
        textClass={styles.homeText}
      />
    </div>
  );
};

export default HomePage;