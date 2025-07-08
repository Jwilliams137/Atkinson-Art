"use client";
import usePageImages from "../../hooks/usePageImages";
import useTextUploads from "../../hooks/useTextUploads";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

const AboutPage = () => {
  const textUploads = useTextUploads("about");
  const { images } = usePageImages("about");

  const statementTexts = textUploads.filter(item => item.type === "general-statement");
  const aboutLinks = textUploads.filter(item => item.type === "about-links" && item.link);

  return (
    <div className={styles.aboutContainer}>
      <h1 className={styles.visuallyHidden}>About Linda Atkinson</h1>

      {statementTexts.map((item, index) => (
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
                <div className={styles.imageDetails}>
                  {item.title && <h2 className={styles.imageTitle}>{item.title}</h2>}
                  {item.description && <p className={styles.imageDescription}>{item.description}</p>}
                </div>
              </div>
            </div>
          );
        })}

      {aboutLinks.length > 0 && (
        <div className={styles.linksRow}>
          {aboutLinks.map((item, index) => (
            <Link
              key={`about-link-${index}`}
              href={item.link}
              className={styles.buttonLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.buttonText || item.link}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AboutPage;