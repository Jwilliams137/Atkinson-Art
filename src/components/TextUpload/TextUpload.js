"use client";
import { useState, useEffect } from "react";
import { getFirestore, query, collection, where, getDocs } from "firebase/firestore";
import styles from "./TextUpload.module.css";

const TextUpload = ({ fieldsList = [], textContent, handleTextChange, handleSubmit, sectionKey, setOrder }) => {
  const [initialPosition, setInitialPosition] = useState(1);
  const [formData, setFormData] = useState({});
  const [yearError, setYearError] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      const db = getFirestore();
      const q = query(collection(db, "textUploads"), where("pageType", "==", sectionKey));
      const querySnapshot = await getDocs(q);
      const nextOrder = querySnapshot.size + 1;

      setInitialPosition(nextOrder);
      if (sectionKey !== "exhibitions") {
        setOrder(nextOrder);
      }
    };

    fetchOrder();
  }, [sectionKey, setOrder]);

  const handleChange = (e, name) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "year") {
      setYearError(false);
    }

    if (name === fieldsList[0]?.name) {
      handleTextChange({ target: { value } });
    }
  };

  const handleCancel = () => {
    const cleared = {};
    fieldsList.forEach(field => {
      if (field?.name) cleared[field.name] = "";
    });
    setFormData(cleared);
    handleTextChange({ target: { value: "" } });
  };

  const handleTextUpload = async () => {
    const includesContentField = fieldsList.some(f => f.name === "content");
    if (sectionKey === "exhibitions") {
      const rawYear = formData.year?.trim();
      const cleanYear = parseInt(rawYear, 10);

      if (!Number.isInteger(cleanYear) || cleanYear < 1000 || cleanYear > 9999) {
        setYearError(true);
        return;
      }

      formData.year = cleanYear;
    }
    const newTextData = {
      ...formData,
      ...(includesContentField ? { content: formData["content"] ?? "" } : {}),
      pageType: sectionKey,
      ...(sectionKey === "exhibitions"
        ? { snippetOrder: initialPosition }
        : { order: initialPosition }
      ),
      type: fieldsList.find(f => f.name === "type")?.value || "general"
    };

    console.log("Submitting:", newTextData);

    await handleSubmit("text-upload", sectionKey, newTextData);
    handleCancel();
  };

  return (
    <div className={styles.textUpload}>
      {fieldsList.map((field, index) => {
        if (!field || !field.name || !field.label) return null;

        if (field.type === "hidden") {
          return (
            <input
              key={field.name}
              type="hidden"
              name={field.name}
              value={field.value || ""}
            />
          );
        }

        const isTextArea = field.type === "text" && index === 0;

        return (
          <div className={styles.field} key={field.name}>
            <label htmlFor={field.name} className={styles.label}>{field.label}</label>
            {isTextArea ? (
              <textarea
                id={field.name}
                className={styles.textArea}
                placeholder={`Enter your ${field.label.toLowerCase()}`}
                rows={5}
                value={formData[field.name] || ""}
                onChange={(e) => handleChange(e, field.name)}
              />
            ) : (
              <>
                <input
                  id={field.name}
                  type={field.type || "text"}
                  className={`${styles.input} ${field.name === "year" && yearError ? styles.errorInput : ""}`}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleChange(e, field.name)}
                />
                {field.name === "year" && yearError && (
                  <p className={styles.errorText}>Year is required (e.g. 2022).</p>
                )}
              </>
            )}
          </div>
        );
      })}

      {formData[fieldsList[0]?.name]?.trim() && (
        <div className={styles.preview}>
          {formData[fieldsList[0]?.name]?.split("\n").map((p, i) =>
            p.trim() ? <p key={i}>{p}</p> : <br key={i} />
          )}
        </div>
      )}

      <div className={styles.buttons}>
        {Object.values(formData).some(value => value?.trim()) && (
          <button className={styles.button} onClick={handleCancel}>Cancel</button>
        )}
        <button className={styles.button} onClick={handleTextUpload}>Submit</button>
      </div>
    </div>
  );
};

export default TextUpload;