'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './AdminModal.module.css';

const AdminModal = ({ item, onClose, onSave, section, excludedFields = [], config }) => {
    const [formState, setFormState] = useState({});
    const [imageEdits, setImageEdits] = useState([]);
    const [color, setColor] = useState("#2e2c2e");

    useEffect(() => {
        if (!item) return;

        const allowedFields = ['title', 'price', 'description', 'dimensions'];
        const editableFields = {};
        allowedFields.forEach((field) => {
            const shouldInclude = config?.pageSettings?.[section]?.editableFields?.includes(field);
            if (shouldInclude) editableFields[field] = item[field] || "";
        });
        setFormState(editableFields);

        const hasValidImageUrls = Array.isArray(item.imageUrls) && item.imageUrls.some(img => img?.url);

        const imageArray = hasValidImageUrls
            ? item.imageUrls
            : item.imageUrl
                ? [{
                    url: item.imageUrl,
                    width: item.width,
                    height: item.height,
                    cloudinaryId: item.cloudinaryId || null,
                    detailOrder: 0
                }]
                : [];

        const filledSlots = imageArray.map((img, index) => ({
            file: null,
            previewUrl: img?.url || null,
            existingData: img || {},
            detailOrder: img?.detailOrder ?? index,
            markedForDeletion: false
        }));

        const maxSlots = config?.pageSettings?.[section]?.singleImageOnly ? 1 : 4;
        while (filledSlots.length < maxSlots) {
            filledSlots.push({
                file: null,
                previewUrl: null,
                existingData: {},
                detailOrder: filledSlots.length,
                markedForDeletion: false
            });
        }

        setImageEdits(filledSlots);
        if (section === "artwork") {
            setColor(item.color || "#2e2c2e");
        }
    }, [item, config, section]);

    const handleFieldChange = (key, value) => {
        setFormState((prev) => ({ ...prev, [key]: value }));
    };

    const handleFileChange = (index, file) => {
        const objectUrl = URL.createObjectURL(file);
        setImageEdits(prev =>
            prev.map((slot, i) =>
                i === index
                    ? { ...slot, file, previewUrl: objectUrl, markedForDeletion: false }
                    : slot
            )
        );
    };

    const moveImageSlot = (index, direction) => {
        const newEdits = [...imageEdits];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= newEdits.length) return;

        [newEdits[index], newEdits[targetIndex]] = [newEdits[targetIndex], newEdits[index]];
        setImageEdits(newEdits.map((slot, i) => ({ ...slot, detailOrder: i })));
    };

    const handleDelete = (index) => {
        setImageEdits(prev =>
            prev.map((slot, i) =>
                i === index
                    ? { ...slot, file: null, previewUrl: null, markedForDeletion: true }
                    : slot
            )
        );
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append("docId", item.id);
        formData.append("pageType", section);
        for (const [key, value] of Object.entries(formState)) {
            formData.append(key, value);
        }
        if (section === "artwork") {
            formData.append("color", color);
        }

        const imageData = [];

        const visibleImageEdits = config?.pageSettings?.[section]?.singleImageOnly
            ? imageEdits.slice(0, 1)
            : imageEdits;

        visibleImageEdits.forEach((slot, index) => {
            const fileKey = `file${index}`;

            const entry = {
                fileKey,
                oldCloudinaryId: slot.existingData?.cloudinaryId || "",
                detailOrder: index,
                delete: slot.markedForDeletion,
            };

            if (slot.markedForDeletion) {
                formData.append(fileKey, new Blob([], { type: "application/octet-stream" }));
            } else if (slot.file) {
                formData.append(fileKey, slot.file);
            } else {
                formData.append(fileKey, new Blob([], { type: "application/octet-stream" }));
            }

            imageData.push(entry);
        });

        formData.append("imageData", JSON.stringify(imageData));

        try {
            const res = await fetch("/api/edit-images", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) {
                console.error("Upload failed:", data.error);
                return;
            }

            onSave({ imageUrls: data.imageUrls });
            onClose();
        } catch (err) {
            console.error("Error uploading images:", err);
        }
    };

    if (!item) return null;

    const visibleImageEdits = config?.pageSettings?.[section]?.singleImageOnly
        ? imageEdits.slice(0, 1)
        : imageEdits;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>Edit {section}</h2>

                {Object.keys(formState).map((field) => (
                    <div key={field} className={styles.field}>
                        <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                        {field === 'description' ? (
                            <textarea
                                value={formState[field] || ""}
                                onChange={(e) => handleFieldChange(field, e.target.value)}
                            />
                        ) : (
                            <input
                                type="text"
                                value={formState[field] || ""}
                                onChange={(e) => handleFieldChange(field, e.target.value)}
                            />
                        )}
                    </div>
                ))}

                {section === "artwork" && (
                    <div className={styles.colorSwatch} style={{ backgroundColor: color }} onClick={() => document.getElementById('hiddenColorInput').click()}>
                        Flip Side Color
                        <input
                            id="hiddenColorInput"
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            style={{ display: "none" }}
                        />
                    </div>
                )}

                <div className={styles.imageEditSection}>
                    <h3>Images</h3>
                    {visibleImageEdits.map((slot, index) => (
                        <div key={index} className={styles.imageSlot}>
                            {slot.previewUrl && !slot.markedForDeletion ? (
                                <div className={styles.previewWrapper}>
                                    <Image
                                        src={slot.previewUrl}
                                        alt={`Image ${index}`}
                                        width={slot.existingData?.width || 300}
                                        height={slot.existingData?.height || 200}
                                        className={styles.preview}
                                    />
                                </div>
                            ) : (
                                <div className={styles.imagePlaceholder}>No image</div>
                            )}

                            <div className={styles.imageControls}>
                                <label className={styles.customFileInput}>
                                    Choose File
                                    <input
                                        type="file"
                                        onChange={(e) => handleFileChange(index, e.target.files[0])}
                                        disabled={slot.markedForDeletion}
                                    />
                                </label>

                                {!config?.pageSettings?.[section]?.singleImageOnly && (
                                    <>
                                        <button
                                            className={styles.deleteButton}
                                            onClick={() => handleDelete(index)}
                                        >
                                            Delete Image
                                        </button>

                                        <div className={styles.reorderButtons}>
                                            <button onClick={() => moveImageSlot(index, -1)}>▲</button>
                                            <button onClick={() => moveImageSlot(index, 1)}>▼</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.buttons}>
                    <button className={styles.button} onClick={handleSubmit}>Save</button>
                    <button className={styles.button} onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default AdminModal;