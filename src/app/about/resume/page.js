"use client";
import useTextUploads from '../../../hooks/useTextUploads';
import TextSection from '../../../components/TextSection/TextSection';
import usePageImages from "../../../hooks/usePageImages";
import ImageGallery from "../../../components/ImageGallery/ImageGallery";
import styles from "./page.module.css";

const ResumePage = () => {
  const textUploads = useTextUploads('resume')
  const { images, nextPage, prevPage, page, hasMore } = usePageImages("resume");

  return (
    <div className={styles.resumeContainer}>
      <TextSection
        textUploads={textUploads}
        containerClass={styles.resumeTextContainer}
        sectionClass={styles.resumeTextSection}
        textClass={styles.resumeTextClass}
      />
      <ImageGallery
        images={images}
        className={styles.resumeGallery}
        cardClass={styles.resumeGalleryCard}
        imageClass={styles.resumeGalleryImage}
        mobileLabelClass={styles.resumeMobileLabel}
        mobileTitleClass={styles.resumeMobileTitle}
        nextPage={nextPage}
        prevPage={prevPage}
        page={page}
        hasMore={hasMore}
        itemsPerPage={20}
      />
    </div>
  );
};

export default ResumePage;