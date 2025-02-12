import React from 'react'
import Sidebar from '../../../../components/Sidebar/Sidebar'
import styles from './page.module.css'

function page() {
    const subpages = [
        { label: 'Sculpture', href: '/artwork/sculpture' },
        { label: 'Paintings', href: '/artwork/paintings' },
        { label: 'Drawings', href: '/artwork/drawings' },
    ];
  return (
    <div className={styles.main}>
        <h2>Paintings</h2>
        <Sidebar subpages={subpages} />
    </div>
  )
}

export default page