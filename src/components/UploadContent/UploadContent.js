"use client";
import React, { useState } from "react";
import styles from "./UploadContent.module.css";
import Image from 'next/image';

const UploadContent = ({ sectionData, handleSubmit, selectedImage, setSelectedImage }) => {
  console.log("sectionData:", sectionData); // Debugging: Log to check data structure

  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  if (!sectionData || Object.keys(sectionData).length === 0) {
    return <div>No data available to display.</div>;
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setSelectedImage(objectUrl); // Update AdminPage state instead of local state

      // Create a new HTMLImageElement to get natural width and height
      const image = new window.Image();
      image.src = objectUrl;

      image.onload = () => {
        setImageDimensions({ width: image.naturalWidth, height: image.naturalHeight });
      };
    }
  };

  return (
    <div className={styles.container}>
      {Object.entries(sectionData.fieldsForPage).map(([sectionKey, fields], index) => {
        const sectionLabel =
          sectionData.sections?.find((section) => section.key === sectionKey)?.label || "Unknown Section";

        return (
          <div key={index} className={styles.uploadSection}>
            <h2 className={styles.title}>{sectionLabel}</h2>

            {fields.map((fieldGroup, idx) => {
              const uploadType = Object.keys(fieldGroup)[0];
              const fieldsList = fieldGroup[uploadType];

              return (
                <div key={idx} className={styles.fieldGroup}>
                  <h3 className={styles.uploadType}>{uploadType.replace("-", " ").toUpperCase()}</h3>

                  {uploadType === "image-upload" && (
                    <div className={styles.imageUpload}>
                      {fieldsList.map((field, fieldIdx) => (
                        <div key={fieldIdx} className={styles.field}>
                          <label htmlFor={field.name} className={styles.label}>
                            {field.label}
                          </label>
                          <input
                            type={field.type}
                            name={field.name}
                            id={field.name}
                            className={styles.inputField}
                            onChange={handleFileChange} // Now updates AdminPage state
                          />
                        </div>
                      ))}

                      {selectedImage && (
                        <div className={styles.imagePreview}>
                          <h4>Image Preview:</h4>
                          <Image
                            src={selectedImage}
                            alt="Selected Image"
                            className={styles.previewImage}
                            width={imageDimensions.width}  // Dynamically set width
                            height={imageDimensions.height}  // Dynamically set height
                          />
                        </div>
                      )}

                      <button className={styles.submitButton} onClick={() => handleSubmit(uploadType, sectionKey)}>
                        Submit Image
                      </button>
                    </div>
                  )}

                  {uploadType === "text-upload" && (
                    <div className={styles.textUpload}>
                      <textarea className={styles.textArea} placeholder="Enter text here..." />
                      <button className={styles.submitButton} onClick={() => handleSubmit(uploadType, sectionKey)}>
                        Submit Text
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default UploadContent;
