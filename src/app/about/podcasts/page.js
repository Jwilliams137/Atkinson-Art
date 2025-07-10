"use client";
import { useState } from "react";
import usePageImages from "../../../hooks/usePageImages";
import useTextUploads from "../../../hooks/useTextUploads";
import PodcastGallery from "../../../components/PodcastGallery/PodcastGallery";
import Link from "next/link";
import styles from "./page.module.css";

const PodcastPage = () => {
  const textUploads = useTextUploads("podcasts");
  const { images } = usePageImages("podcasts");

  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const toggleDescription = (index) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const normalizedImages = images
    .filter((item) => item.type === "podcast-image")
    .map((item) => {
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

      if (!displayImage) return null;

      return {
        ...item,
        imageUrl: displayImage.url,
        width: displayImage.width,
        height: displayImage.height,
      };
    })
    .filter(Boolean);

  const podcastLinks = textUploads.filter((item) => item.type === "podcast-links" && item.link);

  return (
    <div className={styles.podcastContainer}>
      <h1 className={styles.visuallyHidden}>Podcasts</h1>

      {podcastLinks.length > 0 && (
        <div className={styles.linksRow}>
          {podcastLinks.map((item, index) => (
            <Link
              key={`podcast-link-${index}`}
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

      <PodcastGallery
        content={[...podcastLinks, ...normalizedImages]}
        expandedDescriptions={expandedDescriptions}
        toggleDescription={toggleDescription}
      />

      {textUploads
        .filter((item) => item.type === "podcast-statement")
        .map((item, index) => (
          <div
            key={`podcast-statement-${index}`}
            className={styles.statementWrapper}
          >
            <p>{item.content}</p>
          </div>
        ))}
    </div>
  );
};

export default PodcastPage;