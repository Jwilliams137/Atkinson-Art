"use client";
import React, { useState, useEffect } from "react";
import { getFirestore, query, collection, where, getDocs, writeBatch, doc } from "firebase/firestore";
import styles from "../ContentUpload/ContentUpload.module.css";

const TextUpload = ({
  fieldsList,
  textContent,
  handleTextChange,
  handleSubmit,
  sectionKey
}) => {
  const [order, setOrder] = useState(null);

  // Function to fetch the next available order number for the pageType
  const getNextTextOrder = async (pageType) => {
    const db = getFirestore();
    const q = query(collection(db, "textUploads"), where("pageType", "==", pageType));

    const querySnapshot = await getDocs(q);
    const existingTextsCount = querySnapshot.size;
    
    // The new text will have an order number of 1 + the current count of texts for the given pageType
    return existingTextsCount + 1;
  };

  // Fetch the next order number when the component mounts
  useEffect(() => {
    const fetchOrder = async () => {
      const nextOrder = await getNextTextOrder(sectionKey);
      setOrder(nextOrder);
    };

    fetchOrder();
  }, [sectionKey]);

  // Function to handle text upload with the new order number
  const handleTextUpload = async () => {
    if (order === null) return;

    const newTextData = {
      content: textContent,
      pageType: sectionKey,
      order: order,  // Add the order field
    };

    await handleSubmit("text-upload", sectionKey, newTextData);

    // Clear the text field after submission
    handleTextChange("");  // Clear text content after submitting
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
      <button
        className={styles.submitButton}
        onClick={handleTextUpload}
        disabled={order === null}  // Disable the button until the order is fetched
      >
        Submit Text
      </button>
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
