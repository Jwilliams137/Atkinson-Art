"use client";
import usePageImages from "../../hooks/usePageImages";
import ImageGallery from "../../components/ImageGallery/ImageGallery";
import useTextUploads from '../../hooks/useTextUploads';
import TextSection from '../../components/TextSection/TextSection';
import styles from "./page.module.css";

const AboutPage = () => {
  const textUploads = useTextUploads("about")
  const { images, nextPage, prevPage, page, hasMore } = usePageImages("about");

  return (
    <div className={styles.aboutContainer}>
      <TextSection
        textUploads={textUploads}
        containerClass={styles.earlierWorkTextContainer}
        sectionClass={styles.earlierWorkTextSection}
        textClass={styles.earlierWorkTextClass}
      />
      <ImageGallery
        images={images}
        className={styles.aboutGallery}
        cardClass={styles.aboutGalleryCard}
        imageClass={styles.aboutGalleryImage}
        mobileLabelClass={styles.aboutMobileLabel}
        mobileTitleClass={styles.aboutMobileTitle}
        nextPage={nextPage}
        prevPage={prevPage}
        page={page}
        hasMore={hasMore}
        itemsPerPage={20}
      />
    </div>
  );
};

export default AboutPage;