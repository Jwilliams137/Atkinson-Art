import Sidebar from '../../components/Sidebar/Sidebar';
import styles from './layout.module.css';

export default function AboutLayout({ children }) {
    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <Sidebar pageKey="about" />
            </div>
            <main className={styles.main}>{children}</main>
        </div>
    );
}