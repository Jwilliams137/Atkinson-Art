"use client";
import { useState, useEffect } from "react";
import styles from "./AdminSidebar.module.css";
import defaultSidebarData from "../../data/admin.json";

const AdminSidebar = ({ setActiveSection, sidebarData }) => {
  const [activeKey, setActiveKey] = useState("home");

  useEffect(() => {
    const savedSection = localStorage.getItem("activeSection");
    if (savedSection) {
      setActiveKey(savedSection);
    }
  }, []);

  const handleClick = (key) => {
    setActiveKey(key);
    setActiveSection(key);
    localStorage.setItem("activeSection", key);
  };

  const sections = sidebarData?.sections?.filter((section) => section?.key && section?.label) 
                   ?? defaultSidebarData.sections;

  if (!sections.length) {
    return <p role="alert">No sections available. Please check your settings.</p>;
  }

  return (
    <div className={styles.sidebar} role="navigation" aria-label="Admin Sidebar">
      <ul role="list">
        {sections.map((section) => (
          <li
            key={section.key}
            role="listitem"
            className={activeKey === section.key ? styles.active : ""}
            onClick={() => handleClick(section.key)}
            aria-current={activeKey === section.key ? "true" : undefined}
          >
            {section.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSidebar;