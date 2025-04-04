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

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setLocalImage(file);
            setSelectedImage(file);

            const objectUrl = URL.createObjectURL(file);
            setFormData(prev => ({
                ...prev,
                file,
            }));

            const image = new window.Image();
            image.src = objectUrl;
            image.onload = () => {
                setImageDimensions({ width: image.naturalWidth, height: image.naturalHeight });
                URL.revokeObjectURL(objectUrl);
            };
        }
    };

    const handleCancel = () => {
        setLocalImage(null);
        setImageDimensions({ width: 0, height: 0 });
        setFormData({});
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleImageUpload = async () => {
        if (imageDimensions.width === 0 || imageDimensions.height === 0) {
            return;
        }

        const color = formData.color || defaultColor;
        const title = formData.title || (fieldsList.find(field => field.name === "title")?.value || "Untitled");
        const description = (formData.description?.trim() || fieldsList.find(field => field.name === "description")?.value || "");
        const dimensions = formData.dimensions || "";
        const price = formData.price ?? null;

        const imageFormData = new FormData();
        imageFormData.append("file", localImage);
        imageFormData.append("section", sectionKey);
        imageFormData.append("pageType", sectionKey);
        imageFormData.append("title", title);
        imageFormData.append("description", description);
        imageFormData.append("dimensions", dimensions);
        imageFormData.append("price", price);
        imageFormData.append("width", imageDimensions.width);
        imageFormData.append("height", imageDimensions.height);
        imageFormData.append("color", color);

        await handleSubmit("image-upload", sectionKey, { ...formData, title, description, dimensions, price, imageDimensions, color }, currentSectionKey);

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
                        <input
                            ref={field.type === "file" ? fileInputRef : null}
                            type={field.type}
                            name={field.name}
                            id={field.name}
                            className={styles.inputField}
                            {...(field.type === "file"
                                ? { onChange: handleFileChange }
                                : {
                                    value: formData[field.name] || "",
                                    onChange: handleInputChange,
                                })}
                        />
                    </div>
                );
            })}

            {localImage && (
                <div className={styles.imagePreview}>
                    <Image
                        src={URL.createObjectURL(localImage)}
                        alt="Selected Image"
                        className={styles.previewImage}
                        width={imageDimensions.width}
                        height={imageDimensions.height}
                    />
                </div>
            )}
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