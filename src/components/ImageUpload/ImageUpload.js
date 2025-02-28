import { useState, useRef } from "react";
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

    const handleInputChange = (event) => {
        setFormData(prev => ({
            ...prev,
            [event.target.name]: event.target.value
        }));
    };

    const handleImageUpload = async () => {
        if (imageDimensions.width === 0 || imageDimensions.height === 0) {
            console.error("Image dimensions are not available.");
            return; // Prevent submission if dimensions aren't set yet
        }

        const title = formData.title || (fieldsList.find(field => field.name === "title")?.value || "Untitled");

        // Send the image dimensions along with other form data
        const imageFormData = new FormData();
        imageFormData.append("file", formData.file);
        imageFormData.append("section", sectionKey);
        imageFormData.append("pageType", sectionKey);
        imageFormData.append("title", title);
        imageFormData.append("width", imageDimensions.width);
        imageFormData.append("height", imageDimensions.height);

        // Call the parent method to handle submission with dimensions
        await handleSubmit("image-upload", sectionKey, { ...formData, title, imageDimensions });

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
                    <h4>Image Preview:</h4>
                    <Image
                        src={URL.createObjectURL(selectedImage)}
                        alt="Selected Image"
                        className={styles.previewImage}
                        width={imageDimensions.width}
                        height={imageDimensions.height}
                    />
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