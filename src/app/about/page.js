"use client";
import { useState } from "react";
import usePageImages from "../../hooks/usePageImages";
import useTextUploads from "../../hooks/useTextUploads";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import PodcastCarousel from "../../components/PodcastCarousel/PodcastCarousel";

const AboutPage = () => {
  const textUploads = useTextUploads("about");
  const { images: imageUploads } = usePageImages("about");
  const combined = [...textUploads, ...imageUploads];

  const typeOrder = [
    "general-statement",
    "about-image",
    "about-links",
    "podcast-image",
    "podcast-statement",
    "podcast-links"
  ];

  const sortedContent = combined.sort((a, b) => {
    return typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type);
  });

  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  const toggleDescription = (index) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className={styles.aboutContainer}>
      {sortedContent.map((item, index) => {
        const key = `${item.type}-${index}`;

        if (item.type === "about-links") {
          return (
            <div key={key} className={styles.linkWrapper}>
              <Link
                href={item.link}
                className={styles.aboutLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.link}
              </Link>
            </div>
          );
        }

        if (item.type === "general-statement") {
          return (
            <div key={key} className={styles.statementWrapper}>
              <p>{item.content}</p>
            </div>
          );
        }

        if (item.type === "about-image" && item.imageUrl) {
          return (
            <div key={key} className={styles.imageCard}>
              <div className={styles.imageWrapper}>
                <Image
                  src={item.imageUrl}
                  alt={item.title || item.type}
                  width={item.width}
                  height={item.height}
                  className={styles.aboutImage}
                />
                <div className={styles.imageDetails}>
                  {item.description}
                </div>
              </div>
            </div>
          );
        }

        return null;
      })}

      <PodcastCarousel
        content={sortedContent}
        expandedDescriptions={expandedDescriptions}
        toggleDescription={toggleDescription}
      />

      {sortedContent.map((item, index) => {
        const key = `${item.type}-${index}`;

        if (item.type === "podcast-statement") {
          return (
            <div key={key} className={styles.statementWrapper}>
              <p>{item.content}</p>
            </div>
          );
        }
        return null;
      })}

      {sortedContent.map((item, index) => {
        const key = `${item.type}-${index}`;

        if (item.type === "podcast-links") {
          return (
            <div key={key} className={styles.linkWrapper}>
              <Link
                href={item.link}
                className={styles.aboutLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.link}
              </Link>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default AboutPage;