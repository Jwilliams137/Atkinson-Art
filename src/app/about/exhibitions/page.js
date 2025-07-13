"use client";
import Image from 'next/image';
import usePageImages from "../../../hooks/usePageImages";
import useTextUploads from "../../../hooks/useTextUploads";
import ExhibitionTextSection from '../../../components/ExhibitionTextSection/ExhibitionTextSection';
import styles from "./page.module.css";

const fixCloudinaryUrl = (url) =>
  url.includes("/upload/") ? url.replace("/upload/", "/upload/a_exif/") : url;

const ExhibitionsPage = () => {
  const { images } = usePageImages("exhibitions");
  const textUploads = useTextUploads("exhibitions");

  return (
    <div className={styles.exhibitionsContainer}>
      <h1 className={styles.visuallyHidden}>Linda Atkinson&apos;s exhibitions</h1>
      <div className={styles.text}>
        <ExhibitionTextSection textUploads={textUploads} />
      </div>

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
                    src={fixCloudinaryUrl(displayImage.url)}
                    alt={image.title || image.type || `Image ${index + 1}`}
                    width={displayImage.width || 400}
                    height={displayImage.height || 300}
                    className={styles.exhibitionImage}
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

export default ExhibitionsPage;