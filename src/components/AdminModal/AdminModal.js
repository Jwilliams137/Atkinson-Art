'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './AdminModal.module.css';

const AdminModal = ({ item, onClose, onSave, section, excludedFields = [] }) => {
    const [formState, setFormState] = useState({});
    const [imageEdits, setImageEdits] = useState([]);

    useEffect(() => {
        if (item) {
            const editableFields = Object.entries(item).reduce((acc, [key, value]) => {
                const alwaysExclude = [
                    "id",
                    "imageUrl",
                    "cloudinaryId",
                    "width",
                    "height",
                    "order",
                    "pageType",
                    "type",
                    "createdAt",
                    "updatedAt",
                    "imageUrls"
                ];

                const skipTitle = section === "artwork" && key === "title";

                if (
                    !alwaysExclude.includes(key) &&
                    !excludedFields.includes(key) &&
                    !skipTitle &&
                    (typeof value === "string" || typeof value === "number")
                ) {
                    acc[key] = value;
                }

                return acc;
            }, {});
            setFormState(editableFields);

            // Image slots
            const imageArray = item.imageUrls || [];
            setImageEdits(imageArray.map((img, index) => ({
                file: null,
                previewUrl: img?.url || null,
                existingData: img || {},
                index
            })));
        }
    }, [item, excludedFields, section]);

    const handleFieldChange = (key, value) => {
        setFormState((prev) => ({ ...prev, [key]: value }));
    };

    const handleFileChange = (index, file) => {
        const objectUrl = URL.createObjectURL(file);
        setImageEdits(prev =>
            prev.map((slot, i) =>
                i === index
                    ? { ...slot, file, previewUrl: objectUrl }
                    : slot
            )
        );
    };

    const handleSubmit = async () => {
        // Bundle updated text fields
        const updatedFields = { ...formState };

        // Bundle updated images — you can enhance this to upload images later
        const updatedImages = await Promise.all(
            imageEdits.map(async (slot) => {
                if (slot.file) {
                    // NOTE: You may want to actually upload the file here and get Cloudinary URL.
                    return {
                        url: slot.previewUrl, // temp! Replace with actual Cloudinary URL
                        cloudinaryId: "placeholder-id",
                        width: null,
                        height: null,
                        detailOrder: slot.index
                    };
                } else {
                    return slot.existingData || {
                        url: null,
                        cloudinaryId: null,
                        width: null,
                        height: null,
                        detailOrder: slot.index
                    };
                }
            })
        );

        updatedFields.imageUrls = updatedImages;
        onSave(updatedFields);
    };

    if (!item) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>Edit {section}</h2>

                {Object.entries(formState).map(([key, value]) => (
                    <div key={key} className={styles.field}>
                        <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                        {key === 'description' ? (
                            <textarea
                                value={value}
                                onChange={(e) => handleFieldChange(key, e.target.value)}
                            />
                        ) : key.toLowerCase().includes('color') ? (
                            <input
                                type="color"
                                value={value}
                                onChange={(e) => handleFieldChange(key, e.target.value)}
                            />
                        ) : (
                            <input
                                type="text"
                                value={value}
                                onChange={(e) => handleFieldChange(key, e.target.value)}
                            />
                        )}
                    </div>
                ))}

                <div className={styles.imageEditSection}>
                    <h3>Images</h3>
                    {imageEdits.map((slot, index) => (
                        <div key={index} className={styles.imageSlot}>
                            {slot.previewUrl ? (
                                <Image
                                    src={slot.previewUrl}
                                    alt={`Image ${index}`}
                                    width={150}
                                    height={100}
                                    className={styles.preview}
                                />
                            ) : (
                                <div className={styles.imagePlaceholder}>No image</div>
                            )}
                            <input
                                type="file"
                                onChange={(e) => handleFileChange(index, e.target.files[0])}
                            />
                        </div>
                    ))}
                </div>

                <div className={styles.buttons}>
                    <button onClick={handleSubmit}>Save</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default AdminModal;