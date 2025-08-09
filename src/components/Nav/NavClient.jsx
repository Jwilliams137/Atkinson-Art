"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import useAuth from "../../hooks/useAuth";
import styles from "./Nav.module.css";

export default function NavClient({ pages, titleMarkup, fontClass }) {
  const { isUserAllowed } = useAuth();
  const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 1000) setIsBurgerMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const toggleBurgerMenu = () => setIsBurgerMenuOpen((s) => !s);
  const closeBurgerMenu = () => setIsBurgerMenuOpen(false);

  const isActive = (href, isParent = false) =>
    (isBurgerMenuOpen && isParent ? pathname === href : pathname === href || pathname.startsWith(href + "/"));

  return (
    <>
      {/* stays absolutely/fixed positioned the same because it's still within the same stacking context */}
      <div
        className={`${styles.hamburgerIcon} ${isBurgerMenuOpen && styles.open}`}
        onClick={toggleBurgerMenu}
        aria-label="Toggle menu"
        role="button"
        aria-expanded={isBurgerMenuOpen}
        tabIndex={0}
      >
        <span></span><span></span><span></span>
      </div>

      {/* 👇 this is back inside .leftNav now, matching your original layout */}
      <div className={styles.linkContainer}>
        <ul className={styles.linkList}>
          {Object.keys(pages).map((key) => {
            const page = pages[key];
            if (page.restricted && !isUserAllowed && key === "admin") return null;
            const href = page.href || `/${key}`;
            return (
              <li key={key}>
                <Link
                  href={href}
                  className={`${styles.link} ${isActive(href, true) ? styles.active : ""}`}
                >
                  {page.label.toUpperCase()}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {isBurgerMenuOpen && (
        <div className={`${styles.burgerMenu} ${styles.open}`}>
          <Link
            href="/"
            className={`${styles.mobileTitle} ${fontClass}`}
            onClick={closeBurgerMenu}
            key={isBurgerMenuOpen ? "menu-open" : "menu-closed"}
          >
            {titleMarkup}
          </Link>

          <ul className={styles.burgerLinkList}>
            {Object.keys(pages).map((key) => {
              const page = pages[key];
              if (page.restricted && !isUserAllowed && key === "admin") return null;
              const href = page.href || `/${key}`;
              return (
                <div key={`${key}-wrapper`} className={styles.burgerList}>
                  <li key={key} className={styles.burgerMainItem}>
                    <Link
                      href={href}
                      className={`${styles.burgerMainLink} ${isActive(href, true) ? styles.active : ""}`}
                      onClick={closeBurgerMenu}
                    >
                      {page.label}
                    </Link>
                    {page.subPages && (
                      <ul className={styles.burgerSubList}>
                        {page.subPages.map((subPage, subIndex) => (
                          <li key={subPage.href || subIndex} className={styles.burgerSubItem}>
                            <Link
                              href={subPage.href}
                              className={`${styles.burgerSubLink} ${isActive(subPage.href) ? styles.active : ""}`}
                              onClick={closeBurgerMenu}
                            >
                              {subPage.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                </div>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}