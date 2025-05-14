import Sidebar from '../../components/Sidebar/Sidebar';
import styles from './layout.module.css';

export const metadata = {
    title: "Art Galleries | Linda Atkinson",
    description: "Explore sculpture and mixed-media work by Linda Atkinson.",
  };

export default function ArtworkLayout({ children }) {
    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <Sidebar pageKey="artwork" />
            </div>
            <main className={styles.main}>{children}</main>
        </div>
    );
}