"use client";
import useTextUploads from '../../../hooks/useTextUploads';
import TextSection from '../../../components/TextSection/TextSection';
import usePageImages from "../../../hooks/usePageImages";
import ImageGallery from "../../../components/ImageGallery/ImageGallery";
import styles from "./page.module.css";

const BioPage = () => {
  const textUploads = useTextUploads('bio')
  const { images, nextPage, prevPage, page, hasMore } = usePageImages("bio")
  return (
    <div className={styles.bioContainer}>
      <h2>Biography</h2>
      <TextSection
        textUploads={textUploads}
      />
      <ImageGallery
        images={images}
        nextPage={nextPage}
        prevPage={prevPage}
        page={page}
        hasMore={hasMore}
        itemsPerPage={20}
      />
    </div>
  );
};

export default BioPage;