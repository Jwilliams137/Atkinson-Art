"use client";
import Image from 'next/image';
import useTextUploads from '../../../hooks/useTextUploads';
import TextSection from '../../../components/TextSection/TextSection';
import usePageImages from "../../../hooks/usePageImages";
import styles from "./page.module.css";

const BioPage = () => {
  const textUploads = useTextUploads('bio');
  const { images } = usePageImages("bio");

  return (
    <div className={styles.bioContainer}>
      <h1>Biography</h1>
      <TextSection textUploads={textUploads} />
      <div className={styles.imageCard}>
        {images.length > 0 && (
          images.map((image, index) => (
            <div className={styles.imageWrapper} key={index}>
              <Image
                src={image.imageUrl}
                alt={image.title || image.type || `Image ${index + 1}`}
                width={image.width || 400}
                height={image.height || 300}
                className={styles.bioImage}
              />
              <div className={styles.imageDetails}>
                {image.description}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BioPage;