"use client";
import { useState } from "react";
import { getAuth } from "firebase/auth";
import styles from "./ContentUpload.module.css";
import ImageUpload from "../ImageUpload/ImageUpload";
import TextUpload from "../TextUpload/TextUpload";
import ResumeUpload from "../ResumeUpload/ResumeUpload";

const ContentUpload = ({ sectionData, selectedImage, setSelectedImage }) => {
    const [textContent, setTextContent] = useState("");
    const [selectedResume, setSelectedResume] = useState(null);
    const [order, setOrder] = useState(null);

    const handleTextChange = (event) => {
        if (!event || !event.target) {
            console.error("Event or event.target is undefined");
            return;
        }
        setTextContent(event.target.value);
    };

    const handleUpload = async (uploadType, sectionKey, formData = {}) => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            console.error("User not authenticated");
            return;
        }

        const token = await user.getIdToken();

        if (!formData.title) {
            const titleField = sectionData.fieldsForPage[sectionKey]?.find(
                (fieldGroup) => fieldGroup["image-upload"]
            )?.["image-upload"]?.find((field) => field.name === "title");

            formData.title = titleField ? titleField.value : "Untitled";
        }

        if (!formData.type) {
            const typeField = sectionData.fieldsForPage[sectionKey]?.find(
                (fieldGroup) => fieldGroup["text-upload"]
            )?.["text-upload"]?.find((field) => field.name === "type");

            formData.type = typeField ? typeField.value : "general";
        }

        try {
            if (uploadType === "image-upload" && formData.file) {
                const { file, title, description, imageDimensions, color, price } = formData;

                if (!imageDimensions) {
                    console.error("Image dimensions are missing.");
                    return;
                }

                const imageFormData = new FormData();
                imageFormData.append("file", selectedImage);
                imageFormData.append("section", sectionKey);
                imageFormData.append("pageType", sectionKey);
                imageFormData.append("title", formData.title);
                imageFormData.append("description", formData.description);
                imageFormData.append("dimensions", formData.dimensions);
                imageFormData.append("price", formData.price);
                imageFormData.append("width", imageDimensions.width);
                imageFormData.append("height", imageDimensions.height);
                imageFormData.append("color", color);
                imageFormData.append("type", formData.type);

                const response = await fetch("/api/upload-image", {
                    method: "POST",
                    body: imageFormData,
                    headers: { Authorization: `Bearer ${token}` },
                });

                const result = await response.json();
                if (response.ok) {
                    setSelectedImage(null);
                } else {
                    console.error("Image upload failed:", result.error);
                }
            }

            if (uploadType === "text-upload" && textContent.trim()) {
                try {
                    const orderResponse = await fetch(`/api/get-max-text-order?pageType=${sectionKey}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (!orderResponse.ok) {
                        console.error("Failed to fetch order data:", orderResponse.status);
                        return;
                    }

                    const data = await orderResponse.json();
                    const nextOrder = data.nextOrder;

                    const textData = {
                        content: textContent,
                        pageType: sectionKey,
                        section: sectionKey,
                        title: formData.title || "Untitled",
                        type: formData.type || "general",
                        timestamp: new Date().toISOString(),
                        order: nextOrder,
                        year: formData.year || ''
                    };

                    const textUploadResponse = await fetch("/api/upload-text", {
                        method: "POST",
                        body: JSON.stringify(textData),
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    const result = await textUploadResponse.json();
                    if (textUploadResponse.ok) {
                        setTextContent("");
                    } else {
                        console.error("Text upload failed:", result.error);
                    }
                } catch (error) {
                    console.error("Error uploading text:", error);
                }
            }

            if (uploadType === "resume-upload" && selectedResume) {
                const resumeFormData = new FormData();
                resumeFormData.append("file", selectedResume);
                resumeFormData.append("section", sectionKey);

                const response = await fetch("/api/upload-resume", {
                    method: "POST",
                    body: resumeFormData,
                    headers: { Authorization: `Bearer ${token}` },
                });

                const result = await response.json();
                if (response.ok) {
                    setSelectedResume(null);
                } else {
                    console.error("Resume upload failed:", result.error);
                }
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    return (
        <div className={styles.container}>
            {Object.entries(sectionData.fieldsForPage).map(([sectionKey, fields], index) => {
                const sectionLabel =
                    sectionData.sections?.find((section) => section.key === sectionKey)?.label || "Unknown Section";

                return (
                    <div key={index} className={styles.uploadSection}>

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
                                            handleSubmit={handleUpload}
                                            sectionKey={sectionKey}
                                        />
                                    )}
                                    {uploadType === "text-upload" && (
                                        <TextUpload
                                            fieldsList={fieldsList}
                                            textContent={textContent}
                                            handleTextChange={handleTextChange}
                                            handleSubmit={handleUpload}
                                            sectionKey={sectionKey}
                                            setOrder={setOrder}
                                        />
                                    )}
                                    {uploadType === "resume-upload" && (
                                        <ResumeUpload
                                            fieldsList={fieldsList}
                                            selectedResume={selectedResume}
                                            setSelectedResume={setSelectedResume}
                                            handleSubmit={handleUpload}
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