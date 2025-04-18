"use client";
import useTextUploads from '../../../hooks/useTextUploads';
import TextSection from '../../../components/TextSection/TextSection';
import usePageImages from "../../../hooks/usePageImages";
import ImageGallery from "../../../components/ImageGallery/ImageGallery";
import styles from "./page.module.css";

const PodcastsPage = () => {
  const textUploads = useTextUploads('podcasts')
  const { images, nextPage, prevPage, page, hasMore } = usePageImages("podcasts");

  return (
    <div className={styles.podcastsContainer}>
      <TextSection
        textUploads={textUploads}
        containerClass={styles.podcastsTextContainer}
        sectionClass={styles.podcastsTextSection}
        textClass={styles.podcastsTextClass}
      />
      <ImageGallery
        images={images}
        className={styles.podcastsGallery}
        cardClass={styles.podcastsGalleryCard}
        imageClass={styles.podcastsGalleryImage}
        mobileLabelClass={styles.podcastsMobileLabel}
        mobileTitleClass={styles.podcastsMobileTitle}
        nextPage={nextPage}
        prevPage={prevPage}
        page={page}
        hasMore={hasMore}
        itemsPerPage={20}
      />
    </div>
  );
};

export default PodcastsPage;