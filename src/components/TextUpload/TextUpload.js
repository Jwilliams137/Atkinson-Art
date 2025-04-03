"use client";
import { useState, useEffect } from "react";
import { getFirestore, query, collection, where, getDocs } from "firebase/firestore";
import styles from "./TextUpload.module.css";

const TextUpload = ({ fieldsList, textContent, handleTextChange, handleSubmit, sectionKey, setOrder }) => {
  const [order, setOrderState] = useState(1);
  const [year, setYear] = useState("");
  const [localText, setLocalText] = useState(textContent || "");

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
    if (!localText.trim()) return;

    handleTextChange({ target: { value: localText } });

    const newTextData = {
      content: localText,
      pageType: sectionKey,
      order,
      type: fieldsList.find((field) => field.name === "type")?.value || "general",
      ...(year && { year }),
    };

    await handleSubmit("text-upload", sectionKey, newTextData);

    handleTextChange({ target: { value: "" } });
    setLocalText("");
    setYear("");
  };

  const handleCancel = () => {
    handleTextChange({ target: { value: "" } });
    setLocalText("");
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
          value={localText}
          onChange={(e) => {
            setLocalText(e.target.value);
            handleTextChange(e);
          }}
          id={fieldsList[0]?.name}
          rows={5}
        />
      </div>

      {sectionKey === "exhibitions" && (
        <div className={styles.field}>
          <label htmlFor="year" className={styles.label}>Year</label>
          <input
            type="text"
            className={styles.yearInput}
            placeholder="Enter year or date"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            id="year"
          />
        </div>
      )}
      {localText.trim() && (
        <div className={styles.preview}>
          <div>
            {localText.split("\n").map((paragraph, index) =>
              paragraph.trim() ? <p key={index}>{paragraph}</p> : <br key={index} />
            )}
          </div>
        </div>
      )}
      <div className={styles.buttons}>
        {(localText.trim() || year.trim()) && (
          <button className={styles.button} onClick={handleCancel}>Cancel</button>
        )}
        <button className={styles.button} onClick={handleTextUpload}>Submit</button>
      </div>
    </div>
  );
};

export default TextUpload;