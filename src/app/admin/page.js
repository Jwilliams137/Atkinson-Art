"use client";

import { useState } from "react";

const AdminPage = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();
    const file = event.target.querySelector('input[type="file"]').files[0];
    const title = event.target.querySelector('input[type="text"]').value;

    if (!file) {
      console.error("No file selected");
      setLoading(false);
      return;
    }

    formData.append("file", file);
    formData.append("title", title); // Add the title to the form data

    try {
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const rawErrorData = await response.text();
        console.error("Error response status:", response.status);
        console.error("Raw Error Response:", rawErrorData);
        throw new Error("Upload failed");
      }

      const data = await response.json();
      console.log("Image uploaded successfully:", data.message);
    } catch (error) {
      console.error("Upload failed:", error.message || error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form id="uploadForm" onSubmit={handleSubmit}>
        <input type="file" name="file" />
        <input type="text" name="title" placeholder="Artwork Title" />
        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default AdminPage;
