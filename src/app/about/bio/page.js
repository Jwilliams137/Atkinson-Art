"use client";
import usePageImages from "../../../hooks/usePageImages";
import ImageGallery from "../../../components/ImageGallery/ImageGallery";
import styles from "./page.module.css";

const BioPage = () => {
  const bioImages = usePageImages("bio");

  return (
    <div className={styles.bioContainer}>
      <ImageGallery images={bioImages} className={styles.bioGallery} />
      <a href="\Linda Atkinson Complete resume 2025 feb.docx.pdf" download>
        Click here to download a PDF of my resume
      </a>
    </div>
    
  );
};

export default BioPage;