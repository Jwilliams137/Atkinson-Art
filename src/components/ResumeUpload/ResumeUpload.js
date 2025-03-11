import { useState } from "react";
import { getAuth } from "firebase/auth";
import styles from "./ResumeUpload.module.css";

const ResumeUpload = ({ sectionKey, handleSubmit }) => {
  const [resume, setResume] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === "application/pdf" || file.type.includes("word"))) {
      setResume(file);
    } else {
      alert("Please select a valid resume file (PDF or DOC).");
    }
  };

  const handleUpload = async () => {
    if (!resume) {
      console.error("No resume selected.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", resume);
  
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        console.error("User not authenticated.");
        return;
      }
  
      const token = await user.getIdToken();
  
      const response = await fetch("/api/upload-resume", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("Resume uploaded:", data.url);
        setResume(null);
  
        const fileInput = document.querySelector(`.${styles.fileInput}`);
        if (fileInput) {
          fileInput.value = "";
        }
      } else {
        console.error("Upload failed:", data.error);
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
    }
  };
    

  return (
    <div className={styles.resumeUpload}>
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        className={styles.fileInput}
      />
      {resume && <p>Selected Resume: {resume.name}</p>}
      <button className={styles.uploadButton} onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload Resume"}
      </button>
    </div>
  );
};

export default ResumeUpload;