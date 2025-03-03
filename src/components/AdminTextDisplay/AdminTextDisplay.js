"use client";
import React from 'react';
import styles from "./AdminTextDisplay.module.css";

const AdminTextDisplay = ({ texts = [], deleteText, moveTextUp, moveTextDown }) => {
  return (
    <div className={styles.textList}>
      {texts.map((text, index) => (
        <div key={text.id || index} className={styles.textItem}>
          <p className={styles.textSnippet}>
            {text.content.length > 100 ? text.content.slice(0, 100) + "..." : text.content}
          </p>
          {text.content.length > 100 && (
            <button className={styles.readMoreButton}>
              Read More
            </button>
          )}
          <button
            onClick={() => deleteText(text.id)}
            className={styles.deleteButton}
          >
            Delete
          </button>
          <div className={styles.reorderButtons}>
            {index > 0 && (
              <button
                onClick={() => moveTextUp(text.id, index)}
                className={styles.moveButton}
              >
                Move Up
              </button>
            )}
            {index < texts.length - 1 && (
              <button
                onClick={() => moveTextDown(text.id, index)}
                className={styles.moveButton}
              >
                Move Down
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminTextDisplay;
