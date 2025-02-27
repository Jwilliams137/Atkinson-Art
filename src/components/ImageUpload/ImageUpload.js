"use client";  
import { useState, useRef } from "react";
import Image from 'next/image';
import styles from "../ContentUpload/ContentUpload.module.css";

const ImageUpload = ({
  fieldsList,
  selectedImage,
  setSelectedImage,
  imageDimensions,
  setImageDimensions,
  handleSubmit,
  sectionKey,
  imageIndex // Pass a unique index to differentiate uploads
}) => {
  const [formData, setFormData] = useState({});
  const fileInputRef = useRef(null); // Create a ref for the file input

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setSelectedImage(file); // Set the selected image file

      setFormData(prev => ({
        ...prev,
        file,
      }));

      const image = new window.Image();
      image.src = objectUrl;
      image.onload = () => {
        setImageDimensions({ width: image.naturalWidth, height: image.naturalHeight });
        URL.revokeObjectURL(objectUrl);
      };
    }
  };

  const handleInputChange = (event) => {
    setFormData(prev => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
  };

  const handleImageUpload = async (event) => {
    // Ensure you pass the correct title for each image upload
    const titleField = fieldsList.find(field => field.name === "title");
    const title = titleField ? titleField.value : "Untitled";

    // Pass unique form data and title for each image upload
    await handleSubmit("image-upload", sectionKey, { ...formData, title });

    // Clear selected image and reset state after successful upload
    setSelectedImage(null);
    setImageDimensions({ width: 0, height: 0 });
    setFormData({}); // Reset formData to clear other fields if necessary

    // Clear the file input after upload using the ref
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input value
    }
  };

  return (
    <div className={styles.imageUpload}>
      {fieldsList.map((field, fieldIdx) => (
        <div key={fieldIdx} className={styles.field}>
          {field.type !== "hidden" && ( 
            <label htmlFor={field.name} className={styles.label}>
              {field.label}
            </label>
          )}
          <input
            ref={field.type === "file" ? fileInputRef : null} // Set ref only for file input
            type={field.type}
            name={field.name}
            id={field.name}
            className={styles.inputField}
            {...(field.type === "file" ? { onChange: handleFileChange } : {
              value: formData[field.name] || "",
              onChange: handleInputChange,
            })}
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
      <button
        className={styles.submitButton}
        onClick={handleImageUpload} // Trigger upload and clear file
      >
        Submit Image
      </button>
    </div>
  );
};

export default ImageUpload;