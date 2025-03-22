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

  const sections = sidebarData?.sections ?? defaultSidebarData.sections;

  if (!sections.length) {
    return <p>No sections available</p>;
  }

  return (
    <div className={styles.sidebar}>
      <ul>
        {sections.map((section) => (
          <li
            key={section.key}
            className={activeKey === section.key ? styles.active : ""}
            onClick={() => handleClick(section.key)}
          >
            {section.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSidebar;