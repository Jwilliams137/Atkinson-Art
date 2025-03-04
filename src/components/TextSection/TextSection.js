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
        {textUploads.map((text, index) => (
          <p className={`${styles.text} ${textClass || ""}`} key={index}>{text}</p>
        ))}
      </div>
    </div>
  );
};

export default TextSection;