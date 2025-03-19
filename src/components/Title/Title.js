"use client";
import React from "react";
import Link from "next/link";
import styles from "./Title.module.css";
import navData from "../../data/navData.json";

const Title = () => {
  const { title } = navData;

  return (
    <Link href="/" className={styles.title}>
      {title.slice(0, 5)} <span className={styles.space}>{title.slice(5)}</span>
    </Link>
  );
};

export default Title;
