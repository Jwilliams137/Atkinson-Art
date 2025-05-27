'use client';
import { useState, useEffect } from 'react';
import styles from './AdminModal.module.css';

const AdminModal = ({ item, onClose, onSave, section, excludedFields = [] }) => {
    const [formState, setFormState] = useState({});

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
        }
    }, [item, excludedFields, section]);

    const handleChange = (key, value) => {
        setFormState((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = () => {
        onSave(item.id, formState);
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
                                onChange={(e) => handleChange(key, e.target.value)}
                            />
                        ) : key.toLowerCase().includes('color') ? (
                            <input
                                type="color"
                                value={value}
                                onChange={(e) => handleChange(key, e.target.value)}
                            />
                        ) : (
                            <input
                                type="text"
                                value={value}
                                onChange={(e) => handleChange(key, e.target.value)}
                            />
                        )}
                    </div>
                ))}

                <div className={styles.buttons}>
                    <button onClick={handleSubmit}>Save</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default AdminModal;