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

  let podcastsInserted = false;

  return (
    <div className={styles.aboutContainer}>
      {sortedContent.map((item, index) => {
        if (item.type === "about-links" && !podcastsInserted) {
          podcastsInserted = true;
          return (
            <>
              <div key="podcasts" className={styles.podcastsHeading}>
                <h2>Podcasts</h2>
              </div>
            </>
          );
        }

        if (item.type === "general-statement") {
          return (
            <div key={index} className={styles.generalStatementWrapper}>
              <p>{item.content}</p>
            </div>
          );
        }

        if (item.imageUrl) {
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
        } else if (item.link) {
          return (
            <div key={index} className={styles.linkWrapper}>
              <Link href={item.link} className={styles.aboutLink} target="_blank" rel="noopener noreferrer">
                {item.link}
              </Link>
            </div>
          );
        }

        if (item.type === "podcast-statement") {
          return (
            <div key={index} className={styles.podcastStatementWrapper}>
              <p>{item.content}</p>
            </div>
          );
        }
      })}
    </div>
  );
};

export default AboutPage;