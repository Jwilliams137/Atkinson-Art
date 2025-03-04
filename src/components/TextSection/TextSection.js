import React from 'react';
import styles from "./TextSection.module.css";

const TextSection = ({ 
  textUploads, 
  containerClass, 
  sectionClass, 
  textClass 
}) => {
  if (!textUploads.length) return null;

  return (
    <div className={`${styles.textContainer} ${containerClass || ""}`}>
      <div className={`${styles.textSection} ${sectionClass || ""}`}>
        {textUploads.map((text, index) => {
          const paragraphs = text.split("\n\n"); // Split on double newlines (paragraph breaks)

          return paragraphs.map((para, idx) => (
            <p
              key={`${index}-${idx}`} // Unique key for each paragraph
              className={`${styles.text} ${textClass || ""}`}
            >
              {para.trim()}
            </p>
          ));
        })}
      </div>
    </div>
  );
};

export default TextSection;
