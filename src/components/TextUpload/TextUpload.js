"use client";
import React, { useState, useEffect } from "react";
import { getFirestore, query, collection, where, getDocs } from "firebase/firestore";
import styles from "../ContentUpload/ContentUpload.module.css";

const TextUpload = ({ fieldsList, textContent, handleTextChange, handleSubmit, sectionKey, setOrder }) => {
  const [order, setOrderState] = useState(1);
  const [year, setYear] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      const db = getFirestore();
      const q = query(collection(db, "textUploads"), where("pageType", "==", sectionKey));
      const querySnapshot = await getDocs(q);
      const nextOrder = querySnapshot.size + 1;

      setOrderState(nextOrder);
      setOrder(nextOrder);
    };

    fetchOrder();
  }, [sectionKey, setOrder]);

  const handleTextUpload = async () => {
    if (!textContent.trim()) return;

    const newTextData = {
      content: textContent,
      pageType: sectionKey,
      order,
      ...(year && { year }),
    };

    await handleSubmit("text-upload", sectionKey, newTextData);

    handleTextChange("");
    setYear("");
  };

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

      {sectionKey === "exhibitions" && (
        <div className={styles.field}>
          <label htmlFor="year" className={styles.label}>Year (optional)</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter year or date"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            id="year"
          />
        </div>
      )}

      <div className={styles.preview}>
        <h3>Preview</h3>
        <div>
          {textContent.split("\n").map((paragraph, index) =>
            paragraph.trim() ? <p key={index}>{paragraph}</p> : <br key={index} />
          )}
        </div>
      </div>

      <button className={styles.submitButton} onClick={handleTextUpload}>
        Submit
      </button>
    </div>
  );
};

export default TextUpload;