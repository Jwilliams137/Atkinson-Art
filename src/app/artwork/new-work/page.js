"use client";
import usePageImages from "../../../hooks/usePageImages";
import ImageGallery from "../../../components/ImageGallery/ImageGallery";
import styles from "./page.module.css";

const NewWorkPage = () => {
  const newWorkImages = usePageImages("new-work");

  return (
    <div className={styles.newWorkContainer}>
      <ImageGallery images={newWorkImages} className={styles.newWorkGallery} />
    </div>
  );
};

export default NewWorkPage;