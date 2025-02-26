"use client";
import { useState } from "react";
import { getAuth } from "firebase/auth";
import styles from "./ContentUpload.module.css";
import ImageUpload from "../ImageUpload/ImageUpload";
import TextUpload from "../TextUpload/TextUpload";
import ResumeUpload from '../ResumeUpload/ResumeUpload'; // Importing the ResumeUpload component

const ContentUpload = ({ sectionData, selectedImage, setSelectedImage }) => {
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    const [textContent, setTextContent] = useState("");
    const [selectedResume, setSelectedResume] = useState(null); // State to manage the selected resume

    const handleTextChange = (event) => {
        setTextContent(event.target.value);
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
                } else {
                    console.error("Image upload failed:", result.error);
                }
            } catch (error) {
                console.error("Error uploading image:", error);
            }
        }

        if (uploadType === "text-upload" && textContent.trim()) {
            const typeField = sectionData.fieldsForPage[sectionKey]
                .find(fieldGroup => fieldGroup["text-upload"])?.["text-upload"]
                .find(field => field.name === 'type');

            const textData = {
                content: textContent,
                pageType: sectionKey,
                section: sectionKey,
                type: typeField?.value || 'untitled',
                timestamp: new Date().toISOString(),
            };

            try {
                const response = await fetch("/api/upload-text", {
                    method: "POST",
                    body: JSON.stringify(textData),
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                const result = await response.json();
                if (response.ok) {
                    setTextContent("");
                } else {
                    console.error("Text upload failed:", result.error);
                }
            } catch (error) {
                console.error("Error uploading text:", error);
            }
        }

        if (uploadType === "resume-upload" && selectedResume) {
            const formData = new FormData();
            formData.append("file", selectedResume);
            formData.append("section", sectionKey);
          
            try {
              const response = await fetch("/api/upload-resume", {
                method: "POST",
                body: formData,
                headers: { Authorization: `Bearer ${token}` },
              });
          
              const result = await response.json();
              if (response.ok) {
                setSelectedResume(null); // Resetting the selected resume after successful upload
              } else {
                console.error("Resume upload failed:", result.error);
              }
            } catch (error) {
              console.error("Error uploading resume:", error);
            }
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
                        <p className={styles.reminder}>
                            Reminder: Add a title to every image even if one isn&apos;t supposed to appear visibly on the site.
                            This helps people who use screen readers and it has benefits for search engine optimization.
                        </p>
                        {fields.map((fieldGroup, idx) => {
                            const uploadType = Object.keys(fieldGroup)[0];
                            const fieldsList = fieldGroup[uploadType];

                            return (
                                <div key={idx} className={styles.fieldGroup}>
                                    {uploadType === "image-upload" && (
                                        <ImageUpload
                                            fieldsList={fieldsList}
                                            selectedImage={selectedImage}
                                            setSelectedImage={setSelectedImage}
                                            imageDimensions={imageDimensions}
                                            setImageDimensions={setImageDimensions}
                                            handleSubmit={handleSubmit}
                                            sectionKey={sectionKey}
                                        />
                                    )}
                                    {uploadType === "text-upload" && (
                                        <TextUpload
                                            fieldsList={fieldsList}
                                            textContent={textContent}
                                            handleTextChange={handleTextChange}
                                            handleSubmit={handleSubmit}
                                            sectionKey={sectionKey}
                                        />
                                    )}
                                    {uploadType === "resume-upload" && (
                                        <ResumeUpload
                                            fieldsList={fieldsList}
                                            selectedResume={selectedResume}
                                            setSelectedResume={setSelectedResume}
                                            handleSubmit={handleSubmit} // This is the correct prop to pass
                                            sectionKey={sectionKey}
                                        />
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

export default ContentUpload;