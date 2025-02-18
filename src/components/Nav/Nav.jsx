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
  const [restrictedUsers, setRestrictedUsers] = useState([]);
  const { title, pages } = navData;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetch("/api/restricted-users")
      .then((res) => res.json())
      .then((data) => setRestrictedUsers(data.restrictedUsers))
      .catch((err) => console.error("Failed to fetch restricted users", err));
  }, []);

  const isUserAllowed = user && restrictedUsers.includes(user.email);

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
                if (page.restricted && !isUserAllowed) return null;
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
    </>
  );
}
