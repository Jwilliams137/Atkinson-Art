"use client";
import { useState } from "react";
import { getAuth } from "firebase/auth";
import styles from "./UploadContent.module.css";
import Image from 'next/image';

const UploadContent = ({ sectionData, selectedImage, setSelectedImage}) => {
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setSelectedImage(file);

      const image = new window.Image();
      image.src = objectUrl;

      image.onload = () => {
        setImageDimensions({ width: image.naturalWidth, height: image.naturalHeight });
        URL.revokeObjectURL(objectUrl);
      };
    }
  };

  const handleSubmit = async (uploadType, sectionKey) => {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) {
      console.error("User not authenticated");
      return;
    }
  
    const token = await user.getIdToken();
  
    if (uploadType === "image-upload" && selectedImage) {
      const formData = new FormData();
      formData.append("file", selectedImage);
      formData.append("section", sectionKey);
      formData.append("pageType", sectionKey);
      formData.append("width", imageDimensions.width);
      formData.append("height", imageDimensions.height);
  
      try {
        const response = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const result = await response.json();
        if (response.ok) {
          setSelectedImage(null);
          setImageDimensions({ width: 0, height: 0 });
  
          const fileInput = document.querySelector('input[type="file"]');
          if (fileInput) fileInput.value = "";
  
        } else {
          console.error("Upload failed:", result.error);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    } else if (uploadType === "text-upload") {
      alert("Text upload feature needs to be implemented!");
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
                            onChange={handleFileChange}
                          />
                        </div>
                      ))}

                      {selectedImage && (
                        <div className={styles.imagePreview}>
                          <h4>Image Preview:</h4>
                          <Image
                            src={URL.createObjectURL(selectedImage)}
                            alt="Selected Image"
                            className={styles.previewImage}
                            width={imageDimensions.width}
                            height={imageDimensions.height}
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
                      <textarea className={styles.textArea} placeholder="Enter your text here"></textarea>
                      <button className={styles.submitButton}>Submit Text</button>
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