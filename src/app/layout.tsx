import { Metadata } from "next";
import "./globals.css";
import styles from './layout.module.css';
import Nav from '../components/Nav/Nav';
import Footer from '../components/Footer/Footer';

export const metadata: Metadata = {
  title: "Linda Atkinson | Art Studio & Gallery",
  description: "Explore mixed media and sculptural works by Linda Atkinson. Available for purchase.",
  robots: "noindex, nofollow",
  openGraph: {
    title: "Linda Atkinson | Art Studio & Gallery",
    description: "Explore mixed media and sculptural works by Linda Atkinson. Available for purchase.",
    url: "https://atkinson-art.netlify.app/",
    siteName: "Linda Atkinson Art",
    images: [
      {
        url: "/SharingImage.jpg",
        width: 1138,
        height: 675,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Linda Atkinson | Art Studio & Gallery",
    description: "Explore mixed media and sculptural works by Linda Atkinson. Available for purchase.",
    images: ["/SharingImage.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={styles.wrapper}>
        <a href="#main-content" className={styles.skipLink}>Skip to content</a>
        <Nav />
        <main id="main-content" className={styles.children_container}>
          {children}
        </main>
        <footer className={styles.footer}>
          <Footer />
        </footer>
      </body>
    </html>
  );
}