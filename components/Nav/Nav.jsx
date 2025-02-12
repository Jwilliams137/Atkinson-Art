'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import styles from './Nav.module.css';

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

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    setIsMenuOpen(false);
  };

  // Function to split the title into spans for chunked animation
  const splitTitle = (text) => {
    return text.split("").map((letter, index) => (
      <span key={index} className={styles.chunkedLetter}>{letter}</span>
    ));
  };

  return (
    <>
      {/* Hamburger menu */}
      <div className={`${styles.hamburger} ${isMenuOpen ? styles.open : ''}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Full-screen overlay menu (only visible on mobile) */}
      {isMenuOpen && (
        <div className={`${styles.fullscreen} ${isMenuOpen ? styles.open : ''}`}>
          <ul className={styles.linkList}>
            <li>
              <Link href="/" className={styles.link} onClick={closeMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/artwork" className={styles.link} onClick={closeMenu}>
                Artwork
              </Link>
            </li>
            <li>
              <Link href="/about" className={styles.link} onClick={closeMenu}>
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className={styles.link} onClick={closeMenu}>
                Contact
              </Link>
            </li>
            {user && (user.email === "jwilliams137.036@gmail.com" || user.email === "linda.atkinson111@gmail.com") && (
              <li>
                <Link href="/admin" className={styles.link} onClick={closeMenu}>
                  Admin
                </Link>
              </li>
            )}
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
              <li>
                <Link href="/artwork" className={styles.link}>
                  ARTWORK
                </Link>
              </li>
              <li>
                <Link href="/about" className={styles.link}>
                  ABOUT
                </Link>
              </li>
              <li>
                <Link href="/contact" className={styles.link}>
                  CONTACT
                </Link>
              </li>
              {user && (user.email === "jwilliams137.036@gmail.com" || user.email === "linda.atkinson111@gmail.com") && (
                <li>
                  <Link href="/admin" className={styles.link}>
                    ADMIN
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
