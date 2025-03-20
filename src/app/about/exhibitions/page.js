"use client";
import usePageImages from "../../../hooks/usePageImages";
import ImageGallery from "../../../components/ImageGallery/ImageGallery";
import useTextUploads from "../../../hooks/useTextUploads";
import ExhibitionTextSection from '../../../components/ExhibitionTextSection/ExhibitionTextSection'
import styles from "./page.module.css";

const ExhibitionsPage = () => {
  const { images, nextPage, prevPage, page, hasMore } = usePageImages("exhibitions");
  const textUploads = useTextUploads("exhibitions");

  return (
    <div className={styles.exhibitionsContainer}>
      <div className={styles.text}>
        <ExhibitionTextSection
          textUploads={textUploads}
        />
      </div>
      <div className={styles.exhibitionsImageContainer}>
        <ImageGallery
          images={images}
          className={styles.exhibitionsGallery}
          cardClass={styles.exhibitionsGalleryCard}
          imageClass={styles.exhibitionsGalleryImage}
          mobileLabelClass={styles.exhibitionsMobileLabel}
          mobileTitleClass={styles.exhibitionsMobileTitle}
          nextPage={nextPage}
          prevPage={prevPage}
          page={page}
          hasMore={hasMore}
          itemsPerPage={20}
        />
      </div>
    </div>
  );
};

export default ExhibitionsPage;