"use client";
import React from 'react';
import usePageImages from "../../../hooks/usePageImages";
import styles from "./page.module.css";

const ExhibitionsPage = () => {
  const exhibitionsImages = usePageImages("exhibitions");

  return (
    <div className={styles.exhibitionsContainer}>
      
    </div>
  );
};

export default ExhibitionsPage;