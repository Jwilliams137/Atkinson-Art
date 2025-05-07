"use client";
import Image from "next/image";
import ImageDetails from "../ImageDetails/ImageDetails";
import styles from "./PodcastCarousel.module.css";

const PodcastCarousel = ({ content, expandedDescriptions, toggleDescription }) => {
  const podcastImages = content.filter(item => item.type === "podcast-image" && item.imageUrl);

  if (podcastImages.length === 0) return null;

  return (
    <div className={styles.podcastCarouselWrapper}>
      <h3 className={styles.carouselHeading}>Podcast</h3>
      <div className={styles.podcastCarousel}>
        {podcastImages.map((item, index) => (
          <div key={index} className={styles.podcastImageCard}>
            <Image
              src={item.imageUrl}
              alt={item.title || item.type}
              width={200}
              height={200}
              className={styles.podcastImage}
            />
            <ImageDetails
              title={item.title || "Untitled Image"}
              description={item.description || ""}
              dimensions={item.dimensions || ""}
              price={item.price || ""}
              isExpanded={!!expandedDescriptions[index]}
              toggleDescription={() => toggleDescription(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PodcastCarousel;