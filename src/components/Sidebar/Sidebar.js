'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Sidebar.module.css";
import sidebarData from "./sidebarData.json";

const Sidebar = ({ pageKey }) => {
    const [isMobile, setIsMobile] = useState(false);
    const subpages = sidebarData[pageKey] || [];

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
            {isMobile && (
                <div className={styles.mobileLinks}>
                    {subpages.map((page) => (
                        <Link key={page.href} href={page.href} className={styles.mobileLink}>
                            {page.label}
                        </Link>
                    ))}
                </div>
            )}
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