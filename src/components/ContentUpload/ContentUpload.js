"use client";
import { useState } from "react";
import { getAuth } from "firebase/auth";
import styles from "./ContentUpload.module.css";
import ImageUpload from "../ImageUpload/ImageUpload";
import TextUpload from "../TextUpload/TextUpload";

const ContentUpload = ({ sectionData, selectedImage, setSelectedImage }) => {
    const [textContent, setTextContent] = useState("");
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
            if (uploadType === "image-upload") {

                if (!(formData instanceof FormData)) {
                    console.error("Expected FormData but got:", typeof formData);
                    return;
                }

                formData.append("pageType", sectionKey);

                const response = await fetch("/api/upload-image", {
                    method: "POST",
                    body: formData,
                    headers: { Authorization: `Bearer ${token}` },
                });

                const result = await response.json();
                if (response.ok) {
                    setSelectedImage(null);
                } else {
                    console.error("Image upload failed:", result.error);
                }
            }

            if (uploadType === "text-upload" && textContent !== null && textContent !== undefined) {
                let nextOrder = 0;

                if (sectionKey === "exhibitions") {
                    const response = await fetch(`/api/get-max-text-order?pageType=${sectionKey}&year=${formData.year || ""}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (!response.ok) {
                        console.error("Failed to fetch snippetOrder:", response.status);
                        return;
                    }

                    const data = await response.json();
                    nextOrder = data.nextOrder;
                } else {
                    const response = await fetch(`/api/get-max-text-order?pageType=${sectionKey}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (!response.ok) {
                        console.error("Failed to fetch order:", response.status);
                        return;
                    }

                    const data = await response.json();
                    nextOrder = data.nextOrder;
                }

                const isExhibition = sectionKey === "exhibitions";
                if (isExhibition) {
                    formData.type = "exhibition";
                }

                const textData = {
                    content: textContent,
                    pageType: sectionKey,
                    section: sectionKey,
                    title: formData.title || "Untitled",
                    type: formData.type || "general",
                    timestamp: new Date().toISOString(),
                    ...(formData.year ? { year: Number(formData.year) } : {}),
                    link: formData.link || '',
                    buttonText: formData.buttonText || '',
                    ...(isExhibition ? { snippetOrder: nextOrder } : { order: nextOrder })
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
            }

        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    return (
        <div className={styles.container}>
            {Object.entries(sectionData.fieldsForPage).map(([sectionKey, fields], index) => {
                return (
                    <div key={index} className={styles.uploadSection}>
                        {fields.map((fieldGroup, idx) => {
                            const uploadType = Object.keys(fieldGroup)[0];
                            const fieldsList = fieldGroup[uploadType];

                            if (sectionKey === "artwork" && uploadType === "image-upload") return null;

                            return (
                                <div key={idx} className={styles.fieldGroup}>
                                    {uploadType === "image-upload" && (
                                        <ImageUpload
                                            fieldsList={fieldsList}
                                            selectedImage={selectedImage}
                                            setSelectedImage={setSelectedImage}
                                            handleSubmit={handleUpload}
                                            sectionKey={sectionKey}
                                            currentSectionKey={sectionKey}
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