"use client";
import { useState } from "react";
import styles from "./AdminTextDisplay.module.css";

const AdminTextDisplay = ({ texts }) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className={styles.textList}>
      {texts.map((text) => {
        const isExpanded = expanded[text.id];
        return (
          <div key={text.id} className={styles.textItem}>
            <p className={styles.textSnippet}>
              {isExpanded ? text.content : text.content.slice(0, 100)}
              {text.content.length > 100 && !isExpanded && "..."}
            </p>
            {text.content.length > 100 && (
              <button
                className={styles.readMoreButton}
                onClick={() => toggleExpand(text.id)}
              >
                {isExpanded ? "Read Less" : "Read More"}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AdminTextDisplay;