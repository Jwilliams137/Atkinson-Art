import React, { useState } from "react";
import styles from "./AdminTextDisplay.module.css";

const AdminTextDisplay = ({ texts = [], deleteText, moveTextUp, moveTextDown }) => {
  const [expandedTextIds, setExpandedTextIds] = useState([]);

  const toggleText = (id) => {
    setExpandedTextIds((prevIds) =>
      prevIds.includes(id) ? prevIds.filter((textId) => textId !== id) : [...prevIds, id]
    );
  };

  return (
    <div className={styles.textList}>
      {texts.map((text, index) => {
        const isExpanded = expandedTextIds.includes(text.id);

        const formattedContent = text.content
          .split("\n\n")
          .map((para) => para.trim())
          .join("\n\n");

        const displayedContent = isExpanded
          ? formattedContent
          : formattedContent.slice(0, 80);

        const paragraphsToDisplay = displayedContent
          .split("\n\n")
          .map((para, idx) => (
            <p key={idx} className={styles.paragraph}>{para}</p>
          ));

        return (
          <div key={text.id || index} className={styles.textItem}>
            <div className={styles.textContent}>
              {text.year && text.year !== "" && (
                <p className={styles.year}>{text.year}</p>
              )}
              <div className={styles.textSnippet}>
                {paragraphsToDisplay}
              </div>
              {formattedContent.length > 80 && (
                <button
                  onClick={() => toggleText(text.id)}
                  className={styles.readMoreButton}
                >
                  {isExpanded ? "Read Less" : "Read More"}
                </button>
              )}
            </div>
            <div className={styles.textActions}>
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
          </div>
        );
      })}
    </div>
  );
};

export default AdminTextDisplay;