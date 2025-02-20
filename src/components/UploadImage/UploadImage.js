"use client";
import { useState } from "react";
import { getAuth } from "firebase/auth";

const UploadImage = ({ pageType, fields }) => {
  const [loading, setLoading] = useState(false);

  // Function to get image dimensions
  const getImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
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
    const file = event.target.querySelector('input[type="file"]').files[0];

    if (!file) {
      console.error("No file selected");
      setLoading(false);
      return;
    }

    try {
      // Get image dimensions before uploading
      const { width, height } = await getImageDimensions(file);

      // Append file and dimensions to formData
      formData.append("file", file);
      formData.append("width", width);
      formData.append("height", height);

      // Append the pageType to formData (passing it dynamically)
      formData.append("pageType", pageType);

      fields.forEach((field) => {
        const input = event.target.querySelector(`input[name="${field.name}"]`);
        if (input) {
          formData.append(field.name, input.value);
        }
      });

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Upload failed:", response.status, errorText);
        throw new Error("Upload failed");
      }

      console.log("Upload successful");
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {fields.map((field) => (
        <div key={field.name}>
          <label>{field.label}:</label>
          <input type={field.type} name={field.name} />
        </div>
      ))}
      <button type="submit" disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>
    </form>
  );
};

export default UploadImage;