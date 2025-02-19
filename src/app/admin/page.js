"use client";
import { useState, useEffect } from "react";
import UploadImage from "../../components/UploadImage/UploadImage";
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
import AdminLogin from "../../components/AdminLogin/AdminLogin";
import styles from "./page.module.css";
import adminData from "../../data/admin.json";
import { auth } from "../../../utils/firebase";

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState("artwork");
  const [fieldsForPage, setFieldsForPage] = useState({});
  const [user, setUser] = useState(null);

  useEffect(() => {
    setFieldsForPage(adminData.fieldsForPage);
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user || null);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className={styles.adminPage}>
      {user && <AdminSidebar setActiveSection={setActiveSection} />} {/* Sidebar only if logged in */}
      
      <div className={styles.adminContentWrapper}>
        <div className={styles.adminTopSection}>
          <AdminLogin />
        </div>

        {user && (
          <div className={styles.adminMainContent}>
            {fieldsForPage[activeSection] && (
              <UploadImage pageType={activeSection} fields={fieldsForPage[activeSection]} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
