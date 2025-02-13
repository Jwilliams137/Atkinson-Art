'use client'
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Sidebar.module.css";
import sidebarData from "./sidebarData.json";

const Sidebar = ({ pageKey }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const subpages = sidebarData[pageKey] || [];

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 1000;
            setIsMobile(mobile);
        };

        handleResize(); // Set initial state
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleMenu = () => {
        setIsOpen((prev) => !prev);
    };

    console.log("isMobile:", isMobile, "isOpen:", isOpen); // Debugging log

    return (
        <div>
            {/* Mobile Sidebar */}
            {isMobile && (
                <div className={styles.mobileSidebar}>
                    <button className={styles.mobileToggle} onClick={toggleMenu}>
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
            )}

            {/* Desktop Sidebar */}
            {!isMobile && (
                <div className={styles.sidebar}>
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
            )}
        </div>
    );
};

export default Sidebar;
