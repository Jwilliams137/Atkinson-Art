"use client";
import Image from 'next/image';
import usePageImages from "../../../hooks/usePageImages";
import useTextUploads from "../../../hooks/useTextUploads";
import ExhibitionTextSection from '../../../components/ExhibitionTextSection/ExhibitionTextSection';
import styles from "./page.module.css";

const ExhibitionsPage = () => {
  const { images } = usePageImages("exhibitions");
  const textUploads = useTextUploads("exhibitions");

  return (
    <div className={styles.exhibitionsContainer}>
      <div className={styles.text}>
        <ExhibitionTextSection textUploads={textUploads} />
      </div>

      <div className={styles.imageCard}>
        {images.length > 0 && (
          images.map((image, index) => (
            <div className={styles.imageWrapper} key={index}>
              <Image
                src={image.imageUrl}
                alt={image.title || image.type || `Image ${index + 1}`}
                width={image.width || 400}
                height={image.height || 300}
                className={styles.exhibitionImage}
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

export default ExhibitionsPage;