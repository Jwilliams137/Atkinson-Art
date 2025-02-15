import React from "react";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>404 - Page Not Found</h2>
      <p className={styles.text}>Oops! We couldn’t find that page.</p>
      <a href="/" className={styles.button}>Go Home</a>
    </div>
  );
}
