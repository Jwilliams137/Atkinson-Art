"use client";
import usePageImages from "../../hooks/usePageImages";
import ImageGallery from "../../components/ImageGallery/ImageGallery";
import styles from "./page.module.css";

const AboutPage = () => {
  const aboutImages = usePageImages("about");

  return (
    <div className={styles.aboutContainer}>
      <ImageGallery images={aboutImages} className={styles.aboutGallery} />
    </div>
  );
};

export default AboutPage;