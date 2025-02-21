"use client";
import usePageImages from "../../hooks/usePageImages";
import ImageGallery from "../../components/ImageGallery/ImageGallery";
import styles from "./page.module.css";

const ShopPage = () => {
  const shopImages = usePageImages("shop");

  return (
    <div className={styles.shopContainer}>
      <ImageGallery images={shopImages} className={styles.shopGallery} />
    </div>
  );
};

export default ShopPage;