import { useState, useRef } from "react";
import Image from 'next/image';
import styles from "./ImageUpload.module.css";

const ImageUpload = ({
    fieldsList,
    selectedImage,
    setSelectedImage,
    handleSubmit,
    sectionKey
}) => {
    const [formData, setFormData] = useState({});
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setSelectedImage(file);
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => {
            const updatedData = { ...prevData, [name]: value };
            return updatedData;
        });
    };    

    const handleImageUpload = async () => {
        if (imageDimensions.width === 0 || imageDimensions.height === 0) {
            return;
        }

        const title = formData.title || (fieldsList.find(field => field.name === "title")?.value || "Untitled");
        const color = formData.color || (fieldsList.find(field => field.name === "color")?.value || "#ffffff");
        const description = (formData.description?.trim() || fieldsList.find(field => field.name === "description")?.value || "");
        const dimensions = formData.dimensions || "";
        const price = formData.price || "";

        const imageFormData = new FormData();
        imageFormData.append("file", formData.file);
        imageFormData.append("section", sectionKey);
        imageFormData.append("pageType", sectionKey);
        imageFormData.append("title", title);
        imageFormData.append("description", description);
        imageFormData.append("dimensions", dimensions);
        imageFormData.append("price", price);
        imageFormData.append("width", imageDimensions.width);
        imageFormData.append("height", imageDimensions.height);
        imageFormData.append("color", color);

        await handleSubmit("image-upload", sectionKey, { ...formData, title, description, dimensions, price, imageDimensions, color });

        setSelectedImage(null);
        setImageDimensions({ width: 0, height: 0 });
        setFormData({});

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className={styles.imageUpload}>
            {fieldsList.map((field, fieldIdx) => (
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
                        {...(field.type === "file" ? { onChange: handleFileChange } : {
                            value: formData[field.name] || "",
                            onChange: handleInputChange,
                        })}
                    />
                </div>
            ))}
            {selectedImage && (
                <div className={styles.imagePreview}>
                    <Image
                        src={URL.createObjectURL(selectedImage)}
                        alt="Selected Image"
                        className={styles.previewImage}
                        width={imageDimensions.width}
                        height={imageDimensions.height}
                    />
                </div>
            )}
            {formData.color && (
                <div className={styles.colorPreview} style={{ backgroundColor: formData.color }}>
                    <p>Selected Color Preview</p>
                </div>
            )}
            <button
                className={styles.submitButton}
                onClick={handleImageUpload}
            >
                Submit Image
            </button>
        </div>
    );
};

export default ImageUpload;