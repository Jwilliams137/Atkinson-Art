import type { Metadata } from "next";
import "./globals.css";
import styles from './layout.module.css'
import Nav from '../../components/Nav/Nav'
import Footer from '../../components/Footer/Footer'

export const metadata: Metadata = {
  title: "Atkinson Art",
  description: "Art Studio of Linda Atkinson",
  robots: "noindex, nofollow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={styles.wrapper}>
        <Nav />
        
        <div className={styles.children_container}>
          {children}
        </div>
        <footer className={styles.footer}>
          <Footer />
        </footer>
      </body>
    </html>
  );
}
