"use client";
import usePageImages from "../../hooks/usePageImages";
import useTextUploads from "../../hooks/useTextUploads";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

const AboutPage = () => {
  const textUploads = useTextUploads("about");
  const { images } = usePageImages("about");

  return (
    <div className={styles.aboutContainer}>
      <h1 className={styles.visuallyHidden}>About Linda Atkinson</h1>

      {textUploads
        .filter(item => item.type === "general-statement")
        .map((item, index) => (
          <div key={`statement-${index}`} className={styles.statementWrapper}>
            <p>{item.content}</p>
          </div>
        ))}

      {images
        .filter(item => item.type === "about-image")
        .map((item, index) => {
          const displayImage =
            item.imageUrls?.length && item.imageUrls[0]?.url
              ? item.imageUrls[0]
              : item.imageUrl
                ? {
                  url: item.imageUrl,
                  width: item.width,
                  height: item.height,
                }
                : null;

          return (
            <div key={`about-image-${index}`} className={styles.imageCard}>
              <div className={styles.imageWrapper}>
                {displayImage ? (
                  <Image
                    src={displayImage.url}
                    alt={item.title || "About Image"}
                    width={displayImage.width || 600}
                    height={displayImage.height || 400}
                    className={styles.aboutImage}
                  />
                ) : (
                  <div className={styles.imagePlaceholder}>No image available</div>
                )}
                <div className={styles.imageDetails}>{item.description}</div>
              </div>
            </div>
          );
        })}

      {textUploads
        .filter(item => item.type === "about-links")
        .map((item, index) => (
          <div key={`about-link-${index}`} className={styles.linkWrapper}>
            <Link href={item.link} className={styles.aboutLink} target="_blank" rel="noopener noreferrer">
              {item.link}
            </Link>
          </div>
        ))}
    </div>
  );
};

export default AboutPage;