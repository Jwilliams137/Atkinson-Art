"use client";
import React, { useState } from "react";
import styles from "./AdminTextDisplay.module.css";

const AdminTextDisplay = ({ texts = [], deleteText, moveTextUp, moveTextDown }) => {
  return (
    <div className={styles.textList}>
      {texts.map((text, index) => {
        const [isExpanded, setIsExpanded] = useState(false);

        const handleReadMoreClick = () => {
          setIsExpanded(!isExpanded); // Toggle the state
        };

        return (
          <div key={text.id || index} className={styles.textItem}>
            <div className={styles.textContent}>
              <p className={styles.textSnippet}>
                {isExpanded || text.content.length <= 100
                  ? text.content
                  : text.content.slice(0, 100) + "..."}
              </p>
              {text.content.length > 100 && (
                <button onClick={handleReadMoreClick} className={styles.readMoreButton}>
                  {isExpanded ? "Read Less" : "Read More"}
                </button>
              )}
              {text.year && text.year !== "" && <p className={styles.year}>{text.year}</p>}
            </div>
            <div className={styles.textActions}>
              <button onClick={() => deleteText(text.id)} className={styles.deleteButton}>
                Delete
              </button>
              <div className={styles.reorderButtons}>
                {index > 0 && (
                  <button onClick={() => moveTextUp(text.id, index)} className={styles.moveButton}>
                    Move Up
                  </button>
                )}
                {index < texts.length - 1 && (
                  <button onClick={() => moveTextDown(text.id, index)} className={styles.moveButton}>
                    Move Down
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminTextDisplay;
