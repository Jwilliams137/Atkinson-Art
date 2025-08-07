'use client';
import { useState, useRef } from "react";
import Image from 'next/image';
import styles from "./ImageUpload.module.css";

const ImageUpload = ({
    fieldsList,
    selectedImage,
    setSelectedImage,
    handleSubmit,
    sectionKey,
    currentSectionKey
}) => {
    const [formData, setFormData] = useState({});
    const [fileInputs, setFileInputs] = useState(() => {
        const initial = {};
        fieldsList?.forEach(field => {
            if (field.type === "file") {
                initial[field.name] = null;
            }
        });
        return initial;
    });
    const [imageDimensions, setImageDimensions] = useState({});
    const fileInputRef = useRef(null);
    const [titleError, setTitleError] = useState(false);

    if (sectionKey === "artwork") return null;

    const handleFileChange = (e, fieldName) => {
        const file = e.target.files[0];
        setFileInputs(prev => ({ ...prev, [fieldName]: file || null }));

        if (file) {
            const objectUrl = URL.createObjectURL(file);
            const img = new window.Image();
            img.src = objectUrl;
            img.onload = () => {
                setImageDimensions(prev => ({
                    ...prev,
                    [fieldName]: { width: img.naturalWidth, height: img.naturalHeight }
                }));
                URL.revokeObjectURL(objectUrl);
            };
            setSelectedImage(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === "title" && value.trim() !== "") {
            setTitleError(false);
        }
    };

    const handleCancel = () => {
        setFormData({});
        setFileInputs({});
        setImageDimensions({});
        setTitleError(false);
    };

    const handleImageUpload = async () => {
        const title = formData.title?.trim() || fieldsList.find(f => f.name === "title")?.value || "";
        if (!title) {
            setTitleError(true);
            return;
        }

        const form = new FormData();
        form.append("section", sectionKey);
        form.append("pageType", sectionKey);
        form.append("title", title);

        fieldsList.forEach((field, index) => {
            const name = field.name;

            if (field.type === "file") {
                const file = fileInputs[name];
                const fileKey = `file${index}`;
                if (file instanceof File && file.size > 0) {
                    const dims = imageDimensions[name] || { width: null, height: null };
                    form.append(fileKey, file);
                    form.append(`width_${fileKey}`, dims.width);
                    form.append(`height_${fileKey}`, dims.height);
                    form.append(`detailOrder_${fileKey}`, index);
                } else {
                    form.append(fileKey, new Blob([], { type: "application/octet-stream" }));
                    form.append(`width_${fileKey}`, null);
                    form.append(`height_${fileKey}`, null);
                    form.append(`detailOrder_${fileKey}`, index);
                }
            }
            else if (field.type !== "hidden") {
                form.append(name, formData[name] || "");
            } else {
                form.append(name, field.value || "");
            }
        });

        try {
            form.append("formReady", "true");
            await handleSubmit("image-upload", sectionKey, form, currentSectionKey);

            handleCancel();
        } catch (err) {
            console.error("Upload failed:", err);
        }
    };

    return (
        <div className={styles.imageUpload}>
            {fieldsList.map((field, index) => {
                if (field.type === "color") {
                    return (
                        <div key={index} className={styles.colorField}>
                            <input
                                type="color"
                                name={field.name}
                                value={formData[field.name] || field.value || "#ffffff"}
                                onChange={handleInputChange}
                                className={styles.colorPreview}
                            />
                            <span className={styles.colorLabel}>{field.label}</span>
                        </div>
                    );
                }

                if (field.type === "file") {
                    return (
                        <div key={index} className={styles.field}>
                            <label htmlFor={field.name} className={styles.label}>{field.label}</label>
                            <input
                                type="file"
                                id={field.name}
                                name={field.name}
                                key={`file-${field.name}`}
                                onChange={(e) => handleFileChange(e, field.name)}
                            />
                            {fileInputs[field.name] && (
                                <div className={styles.imagePreview}>
                                    <Image
                                        src={
                                            fileInputs[field.name] instanceof File
                                                ? URL.createObjectURL(fileInputs[field.name])
                                                : fileInputs[field.name]
                                        }
                                        alt={`Preview ${field.name}`}
                                        width={imageDimensions[field.name]?.width || 150}
                                        height={imageDimensions[field.name]?.height || 100}
                                        className={styles.previewImage}
                                    />
                                </div>
                            )}
                        </div>
                    );
                }

                return (
                    <div key={index} className={styles.field}>
                        {field.type !== "hidden" && (
                            <label htmlFor={field.name} className={styles.label}>{field.label}</label>
                        )}
                        <input
                            type={field.type}
                            id={field.name}
                            name={field.name}
                            value={formData[field.name] || ""}
                            onChange={handleInputChange}
                            className={`${styles.inputField} ${field.name === "title" && titleError ? styles.errorInput : ""}`}
                        />
                        {field.name === "title" && titleError && (
                            <p className={styles.errorText}>Title is required.</p>
                        )}
                    </div>
                );
            })}

            <div className={styles.buttons}>
                <button onClick={handleCancel} className={styles.button}>Cancel</button>
                <button onClick={handleImageUpload} className={styles.button}>Submit</button>
            </div>
        </div>
    );
};

export default ImageUpload;