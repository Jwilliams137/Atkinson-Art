"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import styles from "./Nav.module.css";
import navLinks from "./navLinks.json"; // Import nav links from JSON file

export default function Nav() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    setIsMenuOpen(false);
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
      {/* Hamburger menu */}
      <div className={`${styles.hamburger} ${isMenuOpen ? styles.open : ""}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Full-screen overlay menu (only visible on mobile) */}
      {isMenuOpen && (
        <div className={`${styles.fullscreen} ${isMenuOpen ? styles.open : ""}`}>
          <ul className={styles.linkList}>
            {navLinks.map((link) => {
              if (link.restricted && (!user || (user.email !== "jwilliams137.036@gmail.com" && user.email !== "linda.atkinson111@gmail.com"))) {
                return null;
              }
              return (
                <li key={link.path}>
                  <Link href={link.path} className={styles.link} onClick={closeMenu}>
                    {link.name}
                  </Link>
                </li>
              );
            })}
            {user && (
              <li>
                <p onClick={handleLogout} className={styles.link}>
                  Logout
                </p>
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Desktop Menu */}
      <div className={styles.nav}>
        <div className={styles.leftNav}>
          <Link href="/" className={styles.title}>
            {splitTitle("Linda Atkinson")}
          </Link>
          <div className={styles.linkContainer}>
            <ul className={styles.linkList}>
              {navLinks.map((link) => {
                if (link.restricted && (!user || (user.email !== "jwilliams137.036@gmail.com" && user.email !== "linda.atkinson111@gmail.com"))) {
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
    </>
  );
}
