"use client";
import { useState } from "react";
import styles from "./AdminSidebar.module.css"; // Ensure your CSS is correct
import sidebarData from "../../data/admin.json"; // Correct path to JSON file

const AdminSidebar = ({ setActiveSection }) => {
  const [activeKey, setActiveKey] = useState("artwork"); // Default section

  const handleClick = (key) => {
    setActiveKey(key);
    setActiveSection(key); // Update parent component with active section
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
