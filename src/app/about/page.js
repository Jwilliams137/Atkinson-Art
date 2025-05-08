"use client";
import { useState } from "react";
import usePageImages from "../../hooks/usePageImages";
import useTextUploads from "../../hooks/useTextUploads";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import ImageDetails from "../../components/ImageDetails/ImageDetails";
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
    "podcast-links",
  ];

  const sortedContent = combined.sort(
    (a, b) => typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type)
  );

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

        switch (item.type) {
          case "about-links":
          case "podcast-links":
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

          case "general-statement":
          case "podcast-statement":
            return (
              <div key={key} className={styles.statementWrapper}>
                <p>{item.content}</p>
              </div>
            );

          case "about-image":
            if (!item.imageUrl) return null;
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
                    <ImageDetails
                      title={item.title || "Untitled Image"}
                      description={item.description || ""}
                      dimensions={item.dimensions || ""}
                      price={item.price || ""}
                      isExpanded={!!expandedDescriptions[index]}
                      toggleDescription={() => toggleDescription(index)}
                    />
                  </div>
                </div>
              </div>
            );

          default:
            return null;
        }
      })}

      <PodcastCarousel
        content={sortedContent}
        expandedDescriptions={expandedDescriptions}
        toggleDescription={toggleDescription}
      />
    </div>
  );
};

export default AboutPage;