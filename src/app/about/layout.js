import Sidebar from '../../components/Sidebar/Sidebar';
import styles from './layout.module.css';

export const metadata = {
    title: "About | Linda Atkinson",
    description: "About Linda Atkinson.",
  };

export default function Layout({ children }) {
    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <Sidebar pageKey="about" />
            </aside>
            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
}