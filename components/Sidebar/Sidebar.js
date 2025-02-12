import Link from 'next/link';
import styles from './Sidebar.module.css';

const Sidebar = ({ subpages }) => {
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

