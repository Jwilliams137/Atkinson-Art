"use client";
import React from 'react';
import styles from "../ContentUpload/ContentUpload.module.css";

const TextUpload = ({
  fieldsList,
  textContent,
  handleTextChange,
  handleSubmit,
  sectionKey
}) => {
  return (
    <div className={styles.textUpload}>
      <div className={styles.field}>
        <label htmlFor={fieldsList[0]?.name} className={styles.label}>
          {fieldsList[0]?.label}
        </label>
        <textarea
          className={styles.textArea}
          placeholder="Enter your text here"
          value={textContent}
          onChange={handleTextChange}
          id={fieldsList[0]?.name}
          rows={5}
        />
      </div>
      <button
        className={styles.submitButton}
        onClick={() => handleSubmit("text-upload", sectionKey)}
      >
        Submit Text
      </button>

      {/* Preview with Paragraph Separation */}
      <div className={styles.preview}>
        <h3>Preview</h3>
        <div>
          {textContent.split("\n").map((paragraph, index) =>
            paragraph.trim() ? <p key={index}>{paragraph}</p> : <br key={index} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TextUpload;
