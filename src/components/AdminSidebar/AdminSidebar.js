"use client";
import React from 'react';
import { useState, useEffect } from "react";
import styles from "./AdminSidebar.module.css";
import sidebarData from "../../data/admin.json";

const AdminSidebar = ({ setActiveSection }) => {
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
  };

  return (
    <div className={styles.sidebar}>
      <ul>
        {sidebarData.sections.map((section) => (
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