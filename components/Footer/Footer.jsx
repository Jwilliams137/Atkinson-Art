import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';
import styles from './Footer.module.css';

function Footer() {
  const getCurrentYear = () => {
    return new Date().getFullYear();
  }

  const copyrightStatement = `© ${getCurrentYear()} Linda Atkinson. All rights reserved.`;

  const socialLinks = [
    { href: "https://www.facebook.com/artistlindaatkinson", icon: faFacebook },
    { href: "https://www.instagram.com/linda.atkinson111/", icon: faInstagram },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.links}>
        {socialLinks.map(({ href, icon }) => (
          <a
            key={href}
            href={href}
            className={styles.navlink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon
              className={styles.socialLink}
              color="#2e2c2e"
              icon={icon}
              size="xl"
            />
          </a>
        ))}
      </div>

      <span className={styles.copyright}>{copyrightStatement}</span>
    </footer>
  );
}

export default Footer;
