"use client";
import { useState } from "react";
import { getAuth } from "firebase/auth";
import styles from "./UploadImage.module.css";

const UploadImage = ({ pageType, fields, onUpload }) => {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const getImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("User not authenticated");
      setLoading(false);
      return;
    }

    const token = await user.getIdToken();
    const formData = new FormData();
    const fileInput = event.target.querySelector('input[type="file"]');
    const file = fileInput.files[0];

    if (!file) {
      console.error("No file selected");
      setLoading(false);
      return;
    }

    try {
      const { width, height } = await getImageDimensions(file);

      formData.append("file", file);
      formData.append("width", width);
      formData.append("height", height);
      formData.append("pageType", pageType);

      fields.forEach((field) => {
        const input = event.target.querySelector(`input[name="${field.name}"]`);
        if (input) formData.append(field.name, input.value);
      });

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        console.error("Upload failed:", response.status, await response.text());
        throw new Error("Upload failed");
      }

      const responseData = await response.json(); // Assuming Cloudinary ID is returned here
      console.log("Upload successful");

      const uploadedImageUrl = URL.createObjectURL(file);

      // Send new image data to AdminPage immediately, including Cloudinary ID
      onUpload({
        imageUrl: uploadedImageUrl,
        cloudinaryId: responseData.cloudinaryId, // Cloudinary ID returned from API
        title: file.name,
        width,
        height,
        pageType
      });

      // Clear form fields
      fileInput.value = "";
      setImagePreview(null);
      fields.forEach((field) => {
        const input = event.target.querySelector(`input[name="${field.name}"]`);
        if (input) input.value = "";
      });

    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.uploadForm}>
      {fields.map((field) => (
        <div key={field.name} className={styles.formField}>
          <label className={styles.label}>{field.label}:</label>
          <input
            type={field.type}
            name={field.name}
            className={styles.input}
            onChange={field.type === "file" ? handleFileChange : undefined}
          />
        </div>
      ))}

      {imagePreview && (
        <div className={styles.previewContainer}>
          <img src={imagePreview} alt="Image Preview" className={styles.previewImage} />
        </div>
      )}

      <button type="submit" disabled={loading} className={styles.submitButton}>
        {loading ? "Uploading..." : "Upload"}
      </button>
    </form>
  );
};

export default UploadImage;