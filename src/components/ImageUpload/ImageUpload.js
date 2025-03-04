import React, { useState, useRef } from "react";
import Image from 'next/image';
import styles from "../ContentUpload/ContentUpload.module.css";

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
                console.log("Image loaded with dimensions:", image.naturalWidth, image.naturalHeight); // Debugging line
                URL.revokeObjectURL(objectUrl);
            };
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => {
            const updatedData = { ...prevData, [name]: value };
            console.log("Updated description:", updatedData.description); // Check if description updates correctly
            return updatedData;
        });
    };
    
    
    
    

    const handleImageUpload = async () => {
        if (imageDimensions.width === 0 || imageDimensions.height === 0) {
            console.error("Image dimensions are not available.");
            return; // Prevent submission if dimensions aren't set yet
        }

        const title = formData.title || (fieldsList.find(field => field.name === "title")?.value || "Untitled");

        // Check for color and add it to formData if available
        const color = formData.color || (fieldsList.find(field => field.name === "color")?.value || "#ffffff");

        // Ensure the description is correctly fetched from formData
        const description = (formData.description?.trim() || fieldsList.find(field => field.name === "description")?.value || "No description provided");



        console.log("Form Data on Submit:", formData); // Debugging line to ensure correct data

        // Send the image dimensions along with other form data
        const imageFormData = new FormData();
        imageFormData.append("file", formData.file);
        imageFormData.append("section", sectionKey);
        imageFormData.append("pageType", sectionKey);
        imageFormData.append("title", title);
        imageFormData.append("description", description); // Include description here
        imageFormData.append("width", imageDimensions.width);
        imageFormData.append("height", imageDimensions.height);
        imageFormData.append("color", color); // Include color in the form data

        // Call the parent method to handle submission with dimensions and color
        console.log("Form Data before submit:", formData);
        await handleSubmit("image-upload", sectionKey, { ...formData, title, description, imageDimensions, color });

        // Reset states
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
