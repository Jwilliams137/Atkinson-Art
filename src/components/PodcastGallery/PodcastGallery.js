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
              width={200}
              height={200}
              className={styles.image}
            />
            {item.description}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PodcastGallery;