"use client";

import styles from "./ComingSoon.module.css";

const ComingSoon = ({ collectionName = "This Gallery" }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1>Coming Soon</h1>
        <p>We’re working on adding artwork to this gallery. Check back again soon!</p>
      </div>
    </div>
  );
};

export default ComingSoon;