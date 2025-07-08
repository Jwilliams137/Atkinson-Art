"use client";
import Image from "next/image";
import styles from "./PodcastGallery.module.css";

const PodcastGallery = ({ content, expandedDescriptions, toggleDescription }) => {
  const podcastImages = content.filter(item => item.type === "podcast-image" && item.imageUrl);

  if (podcastImages.length === 0) return null;

  return (
    <div className={styles.galleryWrapper}>
      <div className={styles.gallery}>
        {podcastImages.map((item, index) => (
          <div key={index} className={styles.imageCard}>
            <Image
              src={item.imageUrl}
              alt={item.title || item.type}
              width={item.width || 600}
              height={item.height || 400}
              className={styles.image}
            />
            <div className={styles.imageDetails}>
              {item.title && <h2 className={styles.imageTitle}>{item.title}</h2>}
              {item.description && <p className={styles.imageDescription}>{item.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PodcastGallery;