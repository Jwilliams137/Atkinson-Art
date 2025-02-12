import React from 'react'
import styles from "./page.module.css"
import Sidebar from '../../../components/Sidebar/Sidebar'

function page() {
    return (
        <div className={styles.main}>
            <h2>Artwork</h2>
            <Sidebar />
        </div>
    )
}

export default page