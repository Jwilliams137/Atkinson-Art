"use client";
import { cld } from "@/utils/cdn";
import Image from 'next/image';
import useTextUploads from '../../../hooks/useTextUploads';
import TextSection from '../../../components/TextSection/TextSection';
import usePageImages from "../../../hooks/usePageImages";
import styles from "./page.module.css";

const BiographyPage = () => {
  const textUploads = useTextUploads('bio');
  const { images } = usePageImages("bio");

  return (
    <div className={styles.bioContainer}>
      <h1>Biography</h1>
      <TextSection textUploads={textUploads} />
      <div className={styles.imageCard}>
        {images.length > 0 &&
          images.map((image, index) => {
            const displayImage =
              image.imageUrls?.length && image.imageUrls[0]?.url
                ? image.imageUrls[0]
                : image.imageUrl
                  ? {
                    url: image.imageUrl,
                    width: image.width,
                    height: image.height,
                  }
                  : null;

            return (
              <div className={styles.imageWrapper} key={index}>
                {displayImage ? (
                  <Image
                    src={cld(displayImage.url, { width: 600 })}
                    unoptimized
                    alt={image.title || image.type || `Image ${index + 1}`}
                    width={displayImage.width || 400}
                    height={displayImage.height || 300}
                    className={styles.bioImage}
                  />
                ) : (
                  <div className={styles.imagePlaceholder}>No image available</div>
                )}
                <div className={styles.imageDetails}>
                  {image.title && <span className={styles.imageTitle}>{image.title}</span>}
                  {image.description && <span className={styles.imageDescription}>{image.description}</span>}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default BiographyPage;