"use client";
import { useState, useEffect } from "react";
import defaultSidebarData from "../../data/admin.json";
import styles from "./AdminSidebar.module.css";

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

  const sections = sidebarData?.sections || defaultSidebarData.sections;

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