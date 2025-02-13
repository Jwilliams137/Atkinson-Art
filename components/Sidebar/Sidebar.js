import Link from 'next/link';
import styles from './Sidebar.module.css';
import sidebarData from './sidebarData.json';

const Sidebar = ({ pageKey }) => {
    const subpages = sidebarData[pageKey] || [];

    return (
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
    );
};

export default Sidebar;
