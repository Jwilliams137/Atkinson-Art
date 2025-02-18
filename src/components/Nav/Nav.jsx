"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "../../../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import styles from "./Nav.module.css";
import navData from "../../data/navData.json";

export default function Nav() {
  const [user, setUser] = useState(null);
  const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false);
  const { title, pages } = navData;

  const [isUserAllowed, setIsUserAllowed] = useState(false);
  const [restrictedUsers, setRestrictedUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        fetch('/api/restricted-users')
          .then(response => response.json())
          .then(data => {
            setRestrictedUsers(data.restrictedUsers);
            setIsUserAllowed(data.restrictedUsers.includes(currentUser.email));
          })
          .catch(error => console.error("Error fetching restricted users:", error));
      } else {
        setIsUserAllowed(false);
        setRestrictedUsers([]);
      }
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