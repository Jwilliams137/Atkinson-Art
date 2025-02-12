import React from 'react'
import Link from 'next/link'
import styles from './Footer.module.css'

function Footer() {
  const getCurrentYear = () => {
    return new Date().getFullYear()
  }

  const copyrightStatement = `© ${getCurrentYear()} Linda Atkinson. All rights reserved.`

  return (
    <footer className={styles.footer}>
      <div className={styles.links}>
      </div>
      <span className={styles.copyright}>{copyrightStatement}</span>
    </footer>
  )
}

export default Footer
