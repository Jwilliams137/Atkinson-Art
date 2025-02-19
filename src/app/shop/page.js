import React from 'react'
import styles from './page.module.css'
import Link from 'next/link';

function page() {
  return (
    <div className={styles.main}>
      <h2>Shop</h2>
      {/*<div className={styles.prompt}>
        <p> Reach out to purchase a piece or request a custom creation</p>
        <Link className={styles.contact} href="/contact">Contact</Link>
      </div>*/}
    </div>
  )
}

export default page
