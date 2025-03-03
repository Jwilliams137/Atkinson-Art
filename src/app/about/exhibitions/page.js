"use client";
import React from 'react';
import usePageImages from "../../../hooks/usePageImages";
import ImageGallery from "../../../components/ImageGallery/ImageGallery";
import styles from "./page.module.css";

const ExhibitionsPage = () => {
  const exhibitionsImages = usePageImages("exhibitions");

  return (
    <div className={styles.exhibitionsContainer}>
      <ImageGallery images={exhibitionsImages} className={styles.exhibitionsGallery} />
    </div>
  );
};

export default ExhibitionsPage;