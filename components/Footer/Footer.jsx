import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';
import styles from './Footer.module.css';
import footerData from './footerData.json';

const iconMapping = {
  faFacebook: faFacebook,
  faInstagram: faInstagram
};

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.links}>
        {footerData.socialLinks.map(({ href, icon }) => (
          <a
            key={href}
            href={href}
            className={styles.navlink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon
              className={styles.socialLink}
              icon={iconMapping[icon]}
              size="xl"
            />
          </a>
        ))}
      </div>
      <span className={styles.copyright}>{footerData.copyright.replace("{year}", new Date().getFullYear())}</span>
    </footer>
  );
}

export default Footer;
