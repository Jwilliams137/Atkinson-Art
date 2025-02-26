"use client";
import Image from 'next/image';
import styles from "../ContentUpload/ContentUpload.module.css";

const ImageUpload = ({
  fieldsList,
  selectedImage,
  setSelectedImage,
  imageDimensions,
  setImageDimensions,
  handleSubmit,
  sectionKey
}) => {
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

  return (
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
      <button className={styles.submitButton} onClick={() => handleSubmit("image-upload", sectionKey)}>
        Submit Image
      </button>
    </div>
  );
};

export default ImageUpload;
