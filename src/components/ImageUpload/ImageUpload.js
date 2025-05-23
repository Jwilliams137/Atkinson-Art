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
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    const [localImage, setLocalImage] = useState(null);
    const fileInputRef = useRef(null);
    const defaultColor = fieldsList.find(field => field.name === "color")?.value || "#ffffff";
    const previewColor = formData.color || defaultColor;
    const [titleError, setTitleError] = useState(false);

    const handleFileChange = (event) => {
        const { files } = event.target;
        if (!files || files.length === 0) return;

        const newFiles = Array.from(files);

        setFormData(prev => ({
            ...prev,
            fileList: [...(prev.fileList || []), ...newFiles]
        }));

        // Keep the first selected image for things like dimensions
        if (!localImage) {
            const objectUrl = URL.createObjectURL(newFiles[0]);
            const img = new window.Image();
            img.src = objectUrl;
            img.onload = () => {
                setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
                URL.revokeObjectURL(objectUrl);
            };
            setLocalImage(newFiles[0]);
            setSelectedImage(newFiles[0]);
        }
    };


    const handleCancel = () => {
        setLocalImage(null);
        setImageDimensions({ width: 0, height: 0 });
        setFormData({});
        setTitleError(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
        if (name === "title" && value.trim() !== "") {
            setTitleError(false);
        }
    };

    const handleImageUpload = async () => {
        if (imageDimensions.width === 0 || imageDimensions.height === 0) return;

        const fallbackTitle = fieldsList.find(field => field.name === "title")?.value?.trim() || "";
        if (!formData.title?.trim() && !fallbackTitle) {
            setTitleError(true);
            return;
        }

        const typeField = fieldsList.find(field => field.name === "type");
        const type = typeField ? (formData.type || typeField.value) : undefined;
        const includeColor = fieldsList.some(field => field.name === "color");
        const color = includeColor ? (formData.color || defaultColor) : undefined;
        const includeDimensions = fieldsList.some(field => field.name === "dimensions");
        const dimensions = includeDimensions ? (formData.dimensions || "") : undefined;
        const includePrice = fieldsList.some(field => field.name === "price");
        const price = includePrice ? (formData.price || "") : undefined;
        const includeDescription = fieldsList.some(field => field.name === "description");
        const description = includeDescription ? (formData.description?.trim() || fieldsList.find(field => field.name === "description")?.value || "") : undefined;
        const title = formData.title?.trim() || fallbackTitle;


        const imageFormData = new FormData();
        const imageFiles = formData.fileList || [];

        if (imageFiles.length === 0) return;

        imageFiles.forEach((file, i) => {
            imageFormData.append(`file${i}`, file);
        });

        imageFormData.append("section", sectionKey);
        imageFormData.append("pageType", sectionKey);
        imageFormData.append("title", title);
        imageFormData.append("width", imageDimensions.width);
        imageFormData.append("height", imageDimensions.height);
        if (color !== undefined) imageFormData.append("color", color);
        if (dimensions !== undefined) imageFormData.append("dimensions", dimensions);
        if (price !== undefined) imageFormData.append("price", price);
        if (description !== undefined) imageFormData.append("description", description);
        if (type !== undefined) imageFormData.append("type", type);

        await handleSubmit("image-upload", sectionKey, {
            ...formData,
            title,
            imageDimensions,
            ...(color !== undefined ? { color } : {}),
            ...(type !== undefined ? { type } : {}),
            ...(dimensions !== undefined ? { dimensions } : {}),
            ...(price !== undefined ? { price } : {}),
            ...(description !== undefined ? { description } : {})
        }, currentSectionKey);

        handleCancel();
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
                                value={previewColor}
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
                        <>
                            <input
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
                        </>
                    </div>
                );
            })}

            {(formData.fileList || []).map((file, index) => (
                <div key={index} className={styles.imagePreview}>
                    <Image
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index}`}
                        width={150}
                        height={100}
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