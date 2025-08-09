import Link from "next/link";
import styles from "./Nav.module.css";
import navData from "../../data/navData.json";
import ClientNav from "./NavClient";
import { Oswald } from "next/font/google";

const oswald = Oswald({ subsets: ["latin"], weight: ["600"], display: "swap" });

export default function Nav() {
  const { title, pages } = navData;

  const splitTitle = (text) =>
    text.split("").map((letter, index) => (
      <span key={index} className={styles.chunkedLetter}>
        {letter}
      </span>
    ));

  const titleMarkup = <span className={oswald.className}>{splitTitle(title)}</span>;

  return (
    <nav>
      <div className={styles.nav}>
        <div className={styles.leftNav}>
          <Link href="/" className={`${styles.title} ${oswald.className}`}>
            {titleMarkup}
          </Link>
          <ClientNav
            pages={pages}
            titleMarkup={titleMarkup}
            fontClass={oswald.className}
          />
        </div>
      </div>
    </nav>
  );
}