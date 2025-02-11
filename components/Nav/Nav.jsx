'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import styles from './Nav.module.css';  // Import the CSS module

export default function Nav() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Listen for user state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Toggle the menu on or off
  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    await auth.signOut();
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Hamburger menu */}
      <div 
        className={`${styles.hamburger} ${isMenuOpen ? styles.open : ''}`} 
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Full-screen menu when open */}
      <div className={`${styles.nav} ${isMenuOpen ? styles.fullscreen : ''}`}>
        <div className={styles.leftNav}>
          <Link href="/" className={styles.title} onClick={closeMenu}>
            Linda Atkinson
          </Link>

          <div className={`${styles.linkContainer} ${isMenuOpen ? styles.open : ''}`}>
            <ul className={styles.linkList}>
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
        </div>
      </div>
    </>
  );
}
