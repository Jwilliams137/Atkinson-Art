"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import styles from "./Nav.module.css";
import navData from "./navData.json";

export default function Nav() {
  const [user, setUser] = useState(null);
  const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false);
  const { title, restrictedUsers, navLinks } = navData;
  const isUserAllowed = user && restrictedUsers.includes(user.email);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

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
              {navLinks.map((link) => {
                if (link.restricted && !isUserAllowed) {
                  return null;
                }
                return (
                  <li key={link.path}>
                    <Link href={link.path} className={styles.link}>
                      {link.name.toUpperCase()}
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
            {navLinks.map((link) => {
              if (link.restricted && !isUserAllowed) {
                return null;
              }
              return (
                <li key={link.path} className={styles.burgerItem}>
                  <Link href={link.path} className={styles.link} onClick={closeBurgerMenu}>
                    {link.name}
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