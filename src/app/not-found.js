import styles from "./not-found.module.css";
import Link from "next/link";

export const metadata = {
  robots: "noindex, nofollow",
  title: "Page Not Found | Your Site Name",
  description: "Sorry, the page you’re looking for doesn’t exist.",
};

export default function NotFound() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>404 - Page Not Found</h2>
      <p className={styles.text}>Oops! We couldn’t find that page.</p>
      <Link href="/" className={styles.button}>Go Home</Link>
    </div>
  );
}