"use client";
import usePageImages from "../../hooks/usePageImages";
import useTextUploads from '../../hooks/useTextUploads';
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

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

  let podcastsHeadingShown = false;

  return (
    <div className={styles.aboutContainer}>
      {sortedContent.map((item, index) => {
        if (item.type === "about-links") {
          return (
            <div key={index} className={styles.linkWrapper}>
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
            <div key={index} className={styles.statementWrapper}>
              <p>{item.content}</p>
            </div>
          );
        }

        if (item.type === "about-image" && item.imageUrl) {
          return (
            <div key={index} className={styles.imageWrapper}>
              <Image
                src={item.imageUrl}
                alt={item.title || item.type}
                width={item.width}
                height={item.height}
                className={styles.aboutImage}
              />
              <p className={styles.imageCaption}>{item.title || "Untitled Image"}</p>
              <p className={styles.imageCaption}>{item.description || ""}</p>
            </div>
          );
        }

        return null;
      })}

      {sortedContent.map((item, index) => {
        if (
          ["podcast-image", "podcast-statement", "podcast-links"].includes(item.type)
        ) {
          if (!podcastsHeadingShown) {
            podcastsHeadingShown = true;
            return (
              <div key={`podcasts-heading`} className={styles.podcastsHeading}>
                <h2>Podcasts</h2>
              </div>
            );
          }
          return null;
        }
        return null;
      })}

      {sortedContent.map((item, index) => {
        if (item.type === "podcast-statement") {
          return (
            <div key={index} className={styles.statementWrapper}>
              <p>{item.content}</p>
            </div>
          );
        }

        if (item.type === "podcast-links") {
          return (
            <div key={index} className={styles.linkWrapper}>
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

        if (item.type === "podcast-image" && item.imageUrl) {
          return (
            <div key={index} className={styles.imageWrapper}>
              <Image
                src={item.imageUrl}
                alt={item.title || item.type}
                width={item.width}
                height={item.height}
                className={styles.aboutImage}
              />
              <p className={styles.imageCaption}>{item.title || "Untitled Image"}</p>
              <p className={styles.imageCaption}>{item.description || ""}</p>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};

export default AboutPage;