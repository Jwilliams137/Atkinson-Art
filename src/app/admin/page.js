"use client";
import { useState } from "react";
import UploadImage from "../../components/UploadImage/UploadImage";
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
import AdminLogin from "../../components/AdminLogin/AdminLogin";
import styles from "./page.module.css"; // Add this for CSS module

const fieldsForPage = {
  artwork: [
    { name: "file", label: "Upload Artwork Image", type: "file" },
    { name: "title", label: "Artwork Title", type: "text" }
  ],
  sculptures: [
    { name: "file", label: "Upload Sculpture Image", type: "file" },
    { name: "title", label: "Title", type: "text" },
    { name: "description", label: "Description", type: "text" },
    { name: "price", label: "Price", type: "number" }
  ],
  paintings: [
    { name: "file", label: "Upload Painting Image", type: "file" },
    { name: "title", label: "Title", type: "text" },
    { name: "description", label: "Description", type: "text" },
    { name: "price", label: "Price", type: "number" }
  ]
};

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState("artwork");

  return (
    <div className={styles.adminPage}>
      <AdminSidebar setActiveSection={setActiveSection} />
      <div className={styles.adminContentWrapper}>
        <div className={styles.adminTopSection}>
          <AdminLogin />
        </div>
        <div className={styles.adminMainContent}>
          {/* Render the UploadImage component based on the active section */}
          {activeSection === "artwork" && <UploadImage pageType="artwork" fields={fieldsForPage.artwork} />}
          {activeSection === "sculptures" && <UploadImage pageType="sculptures" fields={fieldsForPage.sculptures} />}
          {activeSection === "paintings" && <UploadImage pageType="paintings" fields={fieldsForPage.paintings} />}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
