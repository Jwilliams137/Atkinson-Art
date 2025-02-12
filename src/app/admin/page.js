import React from 'react'
import AdminLogin from '../../../components/AdminLogin/AdminLogin';
import styles from "./page.module.css"

function AdminPage() {
  return (
    <div className={styles.main}>
        <h2>Admin</h2>
        <AdminLogin/>    
    </div>
  )
}

export default AdminPage;