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
    const [imageDimensions, setImageDimensions] = useState({});
    const [localImage, setLocalImage] = useState(null);
    const fileInputRef = useRef(null);
    const [titleError, setTitleError] = useState(false);
    const [fileInputKey, setFileInputKey] = useState(Date.now());

    const handleFileChange = (event) => {
        const { files } = event.target;
        if (!files || files.length === 0) return;

        const newFiles = Array.from(files);

        setFormData(prev => ({
            ...prev,
            fileList: [...(prev.fileList || []), ...newFiles]
        }));

        newFiles.forEach((file) => {
            const objectUrl = URL.createObjectURL(file);
            const img = new window.Image();
            img.src = objectUrl;
            img.onload = () => {
                setImageDimensions(prev => ({
                    ...prev,
                    [file.name]: { width: img.naturalWidth, height: img.naturalHeight }
                }));
                URL.revokeObjectURL(objectUrl);
            };
        });

        setLocalImage(newFiles[0]);
        setSelectedImage(newFiles[0]);
    };

    const handleCancel = () => {
        setLocalImage(null);
        setImageDimensions({});
        setFormData({});
        setTitleError(false);
        setFileInputKey(Date.now());
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
        if (name === "title" && value.trim() !== "") {
            setTitleError(false);
        }
    };

    const handleImageUpload = async () => {
        if (!formData.fileList || formData.fileList.length === 0) return;

        const fallbackTitle = fieldsList.find(field => field.name === "title")?.value?.trim() || "";
        if (!formData.title?.trim() && !fallbackTitle) {
            setTitleError(true);
            return;
        }

        const hasColorField = fieldsList.some(field => field.name === "color");
        const colorValue = hasColorField
            ? (formData.color?.trim() || fieldsList.find(field => field.name === "color")?.value || "").trim()
            : undefined;

        const typeField = fieldsList.find(field => field.name === "type");
        const type = typeField ? (formData.type || typeField.value) : undefined;

        const includeDimensions = fieldsList.some(field => field.name === "dimensions");
        const dimensions = includeDimensions ? (formData.dimensions || "") : undefined;

        const includePrice = fieldsList.some(field => field.name === "price");
        const price = includePrice ? (formData.price || "") : undefined;

        const includeDescription = fieldsList.some(field => field.name === "description");
        const description = includeDescription
            ? (formData.description?.trim() || fieldsList.find(field => field.name === "description")?.value || "")
            : undefined;

        const title = formData.title?.trim() || fallbackTitle;

        const imageFormData = new FormData();

        formData.fileList.forEach((file, i) => {
            const dims = imageDimensions[file.name] || { width: 0, height: 0 };
            imageFormData.append(`file${i}`, file);
            imageFormData.append(`width${i}`, dims.width);
            imageFormData.append(`height${i}`, dims.height);
            imageFormData.append(`detailOrder${i}`, i);
        });

        imageFormData.append("section", sectionKey);
        imageFormData.append("pageType", sectionKey);
        imageFormData.append("title", title);
        if (hasColorField && colorValue) imageFormData.append("color", colorValue);
        if (dimensions !== undefined) imageFormData.append("dimensions", dimensions);
        if (price !== undefined) imageFormData.append("price", price);
        if (description !== undefined) imageFormData.append("description", description);
        if (type !== undefined) imageFormData.append("type", type);

        try {
            await handleSubmit("image-upload", sectionKey, {
                ...formData,
                title,
                imageDimensions,
                ...(hasColorField && colorValue ? { color: colorValue } : {}),
                ...(type !== undefined ? { type } : {}),
                ...(dimensions !== undefined ? { dimensions } : {}),
                ...(price !== undefined ? { price } : {}),
                ...(description !== undefined ? { description } : {})
            }, currentSectionKey);

            handleCancel();
        } catch (err) {
            console.error("Upload failed:", err);
        }
    };

    const isFormFilled = localImage || Object.values(formData).some(value => value);

    return (
        <div className={styles.imageUpload}>
            {fieldsList.map((field, fieldIdx) => {
                if (field.type === "color") {
                    return (
                        <div key={fieldIdx} className={styles.colorField}>
                            <input
                                type="color"
                                name={field.name}
                                id={field.name}
                                value={formData.color || (fieldsList.find(f => f.name === "color")?.value || "#ffffff")}
                                onChange={handleInputChange}
                                className={styles.colorPreview}
                            />
                            <span className={styles.colorLabel}>{field.label}</span>
                        </div>
                    );
                }

                return (
                    <div key={fieldIdx} className={styles.field}>
                        {field.type !== "hidden" && (
                            <label htmlFor={field.name} className={styles.label}>
                                {field.label}
                            </label>
                        )}
                        <input
                            key={field.type === "file" ? fileInputKey : undefined}
                            ref={field.type === "file" ? fileInputRef : null}
                            type={field.type}
                            name={field.name}
                            id={field.name}
                            multiple={field.type === "file"}
                            className={`${styles.inputField} ${field.name === "title" && titleError ? styles.errorInput : ""}`}
                            {...(field.type === "file"
                                ? { onChange: handleFileChange }
                                : {
                                    value: formData[field.name] || "",
                                    onChange: handleInputChange,
                                })}
                        />
                        {field.name === "title" && titleError && (
                            <p className={styles.errorText}>Title is required.</p>
                        )}
                    </div>
                );
            })}

            {(formData.fileList || []).map((file, index) => (
                <div key={index} className={styles.imagePreview}>
                    <Image
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index}`}
                        width={imageDimensions[file.name]?.width || 150}
                        height={imageDimensions[file.name]?.height || 100}
                        className={styles.previewImage}
                    />
                </div>
            ))}

            <div className={styles.buttons}>
                {isFormFilled && (
                    <button onClick={handleCancel} className={styles.button}>Cancel</button>
                )}
                <button
                    className={styles.button}
                    onClick={handleImageUpload}
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default ImageUpload;