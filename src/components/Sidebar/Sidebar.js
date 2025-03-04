"use client";
import React from 'react';
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Sidebar.module.css";
import navData from "../../data/navData.json";

const Sidebar = ({ pageKey }) => {
    const [isMobile, setIsMobile] = useState(false);
    const subpages = navData.pages[pageKey]?.subPages || [];

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 1000);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return (
        <>
            <div className={`${styles.sidebar} ${isMobile ? styles.hideDesktop : styles.showDesktop}`}>
                <nav>
                    <ul className={styles.navList}>
                        {subpages.map((page) => (
                            <li key={page.href} className={styles.navItem}>
                                <Link href={page.href} className={styles.navLink}>
                                    {page.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default Sidebar;