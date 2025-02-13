'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Sidebar.module.css";
import sidebarData from "./sidebarData.json";

const Sidebar = ({ pageKey }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
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
            {/* Mobile Sidebar */}
            <div className={`${styles.mobileSidebar} ${isMobile ? styles.showMobile : styles.hideMobile}`}>
                <button className={styles.mobileToggle} onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? "▲ Hide Menu" : "▼ Show Menu"}
                </button>
                {isOpen && (
                    <nav className={styles.mobileNav}>
                        <ul className={styles.navList}>
                            {subpages.map((page) => (
                                <li key={page.href} className={styles.navItem}>
                                    <Link href={page.href} className={styles.navLink} onClick={() => setIsOpen(false)}>
                                        {page.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                )}
            </div>

            {/* Desktop Sidebar */}
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
