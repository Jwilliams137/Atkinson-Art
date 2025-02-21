"use client";
import usePageImages from "../../../hooks/usePageImages";
import ImageGallery from "../../../components/ImageGallery/ImageGallery";
import styles from "./page.module.css";

const NewWorkPage = () => {
  const bioImages = usePageImages("new-work");

  return (
    <div className={styles.bioContainer}>
      <ImageGallery images={bioImages} className={styles.newWorkGallery} />
    </div>
  );
};

export default NewWorkPage;
