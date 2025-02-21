"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import styles from "./Nav.module.css";
import navData from "../../data/navData.json";

export default function Nav() {
  const { user, isUserAllowed } = useAuth();
  const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false);
  const { title, pages } = navData;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1000) {
        setIsBurgerMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleBurgerMenu = () => {
    setIsBurgerMenuOpen((prevState) => !prevState);
  };

  const closeBurgerMenu = () => {
    setIsBurgerMenuOpen(false);
  };

  const splitTitle = (text) => {
    return text.split("").map((letter, index) => (
      <span key={index} className={styles.chunkedLetter}>
        {letter}
      </span>
    ));
  };

  return (
    <>
      <div className={styles.nav}>
        <div className={styles.leftNav}>
          <Link href="/" className={styles.title}>
            {splitTitle(title)}
          </Link>
          <div className={styles.linkContainer}>
            <ul className={styles.linkList}>
              {Object.keys(pages).map((key) => {
                const page = pages[key];
                if (page.restricted && !isUserAllowed && key === 'admin') {
                  return null;
                }

                return (
                  <li key={key}>
                    <Link href={page.href || `/${key}`} className={styles.link}>
                      {page.label.toUpperCase()}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      <div
        className={`${styles.hamburgerIcon} ${isBurgerMenuOpen && styles.open}`}
        onClick={toggleBurgerMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {isBurgerMenuOpen && (
        <div className={`${styles.burgerMenu} ${isBurgerMenuOpen ? styles.open : ""}`}>
          <Link href="/" className={styles.mobileTitle} onClick={closeBurgerMenu}>
            {splitTitle(title)}
          </Link>
          <ul className={styles.linkList}>
            {Object.keys(pages).map((key) => {
              const page = pages[key];
              if (page.restricted && !isUserAllowed && key === 'admin') {
                return null;
              }
              return (
                <li key={key} className={styles.burgerItem}>
                  <Link href={page.href || `/${key}`} className={styles.link} onClick={closeBurgerMenu}>
                    {page.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}