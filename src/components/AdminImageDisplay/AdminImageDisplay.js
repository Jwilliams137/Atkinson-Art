'use client';
import { useState } from "react";
import Image from "next/image";
import { getFirestore, doc, writeBatch, updateDoc } from "firebase/firestore";
import styles from "./AdminImageDisplay.module.css";

const AdminImageDisplay = ({ images, setImages, isAdmin, activeSection }) => {
  const db = getFirestore();
  const [editingId, setEditingId] = useState(null);
  const [editFields, setEditFields] = useState({});
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  const excludedFields = ["id", "imageUrl", "cloudinaryId", "createdAt", "updatedAt", "order", "width", "height"];

  const toggleDescription = (id) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const deleteImage = async (imageId, cloudinaryId) => {
    if (!isAdmin) return;
    try {
      const response = await fetch("/api/delete-image", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cloudinaryId, imageId }),
      });
      if (response.ok) {
        setImages(images.filter((image) => image.id !== imageId));
      } else {
        console.error("Error deleting image:", await response.json());
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const reorderImages = async (index, direction) => {
    if (!isAdmin || (direction === -1 && index === 0) || (direction === 1 && index === images.length - 1)) return;
    const newImages = [...images];
    const swapIndex = index + direction;
    [newImages[index], newImages[swapIndex]] = [newImages[swapIndex], newImages[index]];
    newImages[index].order = index;
    newImages[swapIndex].order = swapIndex;
    setImages([...newImages]);
    const batch = writeBatch(db);
    batch.update(doc(db, "uploads", newImages[index].id), { order: index });
    batch.update(doc(db, "uploads", newImages[swapIndex].id), { order: swapIndex });
    await batch.commit();
  };

  const handleEdit = (image) => {
    const editableFields = Object.entries(image)
      .filter(([key, value]) => {
        const isExcluded =
          ["id", "imageUrl", "cloudinaryId", "width", "height", "order", "pageType"].includes(key) ||
          (activeSection === "artwork" && key === "title");
        return (
          !isExcluded &&
          (typeof value === "string" || typeof value === "number")
        );
      })
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    setEditingId(image.id);
    setEditFields(editableFields);
  };

  const handleSave = async (id) => {
    try {
      await updateDoc(doc(db, "uploads", id), editFields);
      setImages((prev) =>
        prev.map((img) =>
          img.id === id ? { ...img, ...editFields } : img
        )
      );
      setEditingId(null);
      setEditFields({});
    } catch (error) {
      console.error("Error saving image:", error);
    }
  };

  return (
    <div className={styles.imagesGrid}>
      {images.map((image, index) => (
        <div key={image.id || index} className={`${styles.imageItem} ${editingId === image.id ? styles.editing : ""}`}>
          <Image
            src={image.imageUrl}
            alt={image.title || "Uploaded Image"}
            width={image.width || 300}
            height={image.height || 200}
            className={editingId === image.id ? styles.editingImage : ""}
            style={
              activeSection === "artwork"
                ? {
                  border: `8px solid ${editingId === image.id
                    ? editFields.color || image.color || "#ccc"
                    : image.color || "#ccc"
                    }`,
                  borderRadius: "8px",
                }
                : {}
            }
          />
          {editingId === image.id ? (
            <div className={styles.editForm}>
              {Object.entries(editFields).map(([key, value]) => (
                <div key={key}>
                  <p>{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                  {key === "description" ? (
                    <textarea
                      value={value}
                      onChange={(e) =>
                        setEditFields({ ...editFields, [key]: e.target.value })
                      }
                      className={styles.editTextarea}
                      placeholder={key}
                    />
                  ) : key.toLowerCase().includes("color") ? (
                    <input
                      type="color"
                      value={value}
                      onChange={(e) =>
                        setEditFields({ ...editFields, [key]: e.target.value })
                      }
                      className={styles.editColorPicker}
                    />
                  ) : (
                    <input
                      type="text"
                      value={value}
                      onChange={(e) =>
                        setEditFields({ ...editFields, [key]: e.target.value })
                      }
                      className={styles.editInput}
                      placeholder={key}
                    />
                  )}
                </div>
              ))}

              <div className={styles.textActions}>
                <button onClick={() => handleSave(image.id)} className={styles.button}>
                  Save
                </button>
                <button onClick={() => setEditingId(null)} className={styles.button}>
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this?")) {
                      deleteImage(image.id, image.cloudinaryId);
                    }
                  }}
                  className={styles.button}
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className={styles.title}>{image.title}</p>
              {image.description && (
                <div className={styles.descriptionWrapper}>
                  <p className={styles.info}>
                    {expandedDescriptions[image.id]
                      ? image.description
                      : `${image.description.slice(0, 50)}${image.description.length > 50 ? "..." : ""}`}
                  </p>
                  {image.description.length > 150 && (
                    <button
                      onClick={() => toggleDescription(image.id)}
                      className={styles.readMoreButton}
                    >
                      {expandedDescriptions[image.id] ? "Read less" : "Read more"}
                    </button>
                  )}
                </div>
              )}

              {image.dimensions && (<p className={styles.info}>{image.dimensions}</p>)}
              {image.price && (<p className={styles.info}>{image.price}</p>)}
              <div className={styles.reorderButtons}>
                {activeSection !== "artwork" && index > 0 && (
                  <button onClick={() => reorderImages(index, -1)} className={styles.moveButton}>
                    ▲
                  </button>
                )}
                {activeSection !== "artwork" && index < images.length - 1 && (
                  <button onClick={() => reorderImages(index, 1)} className={styles.moveButton}>
                    ▼
                  </button>
                )}
              </div>
              <div className={styles.textActions}>
                {isAdmin && (
                  <>
                    <button onClick={() => handleEdit(image)} className={styles.button}>
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this?")) {
                          deleteImage(image.id, image.cloudinaryId);
                        }
                      }}
                      className={styles.button}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminImageDisplay;