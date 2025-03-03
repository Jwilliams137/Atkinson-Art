import React from 'react';
import styles from "./UnderConstruction.module.css";

export default function UnderConstruction() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Under Construction</h1>
      <p className={styles.text}>Please excuse our mess</p>
    </div>
  );
}