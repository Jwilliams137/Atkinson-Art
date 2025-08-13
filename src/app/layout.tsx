import { Metadata } from "next";
import "./globals.css";
import styles from "./layout.module.css";
import Nav from "../components/Nav/Nav";
import Footer from "../components/Footer/Footer";

export const metadata: Metadata = {
  title: "Linda Atkinson | Art Studio & Gallery",
  description: "Explore mixed media and sculptural works by Linda Atkinson. Available for purchase.",
  robots: "index, follow",
  openGraph: {
    title: "Linda Atkinson | Art Studio & Gallery",
    description: "Explore mixed media and sculptural works by Linda Atkinson. Available for purchase.",
    url: "https://lindaatkinsonart.com",
    siteName: "Linda Atkinson Art",
    images: [
      { url: "https://lindaatkinsonart.com/SharingImage.jpg", width: 1138, height: 675 },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Linda Atkinson | Art Studio & Gallery",
    description: "Explore mixed media and sculptural works by Linda Atkinson. Available for purchase.",
    images: ["https://lindaatkinsonart.com/SharingImage.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
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