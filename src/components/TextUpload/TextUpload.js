"use client";
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
        />
      </div>
      <button className={styles.submitButton} onClick={() => handleSubmit("text-upload", sectionKey)}>
        Submit Text
      </button>
    </div>
  );
};

export default TextUpload;
