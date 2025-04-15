'use client';
import { useState } from "react";
import Image from "next/image";
import { getFirestore, doc, writeBatch, updateDoc } from "firebase/firestore";
import styles from "./AdminImageDisplay.module.css";

const AdminImageDisplay = ({ images, setImages, isAdmin, activeSection }) => {
  const db = getFirestore();
  const [editingId, setEditingId] = useState(null);
  const [editFields, setEditFields] = useState({});

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
    setEditingId(image.id);
    setEditFields({
      title: image.title || "",
      price: image.price || "",
      description: image.description || "",
      dimensions: image.dimensions || ""
    });
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
          />
          {editingId === image.id ? (
            <div className={styles.editForm}>
              {image.title && (
                <div>
                  <p>Title</p>
                  <input
                    type="text"
                    value={editFields.title}
                    onChange={(e) => setEditFields({ ...editFields, title: e.target.value })}
                    className={styles.editInput}
                    placeholder="Title"
                  />
                </div>
              )}
              {typeof image.price && (
                <div>
                  <p>Price</p>
                  <input
                    type="text"
                    value={editFields.price}
                    onChange={(e) => setEditFields({ ...editFields, price: e.target.value })}
                    className={styles.editInput}
                    placeholder="Price"
                  />
                </div>
              )}
              {image.dimensions && (
                <div>
                  <p>Dimensions</p>
                  <input
                    type="text"
                    value={editFields.dimensions}
                    onChange={(e) => setEditFields({ ...editFields, dimensions: e.target.value })}
                    className={styles.editInput}
                    placeholder="Dimensions"
                  />
                </div>
              )}
              {image.description && (
                <div>
                  <p>Description</p>
                  <textarea
                    value={editFields.description}
                    onChange={(e) => setEditFields({ ...editFields, description: e.target.value })}
                    className={styles.editTextarea}
                    placeholder="Description"
                  />
                </div>
              )}
              <div className={styles.textActions}>
                <button onClick={() => handleSave(image.id)} className={styles.button}>
                  Save
                </button>
                <button onClick={() => setEditingId(null)} className={styles.button}>
                  Cancel
                </button>
                <button onClick={() => deleteImage(image.id, image.cloudinaryId)} className={styles.button}>
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className={styles.title}>{image.title}</p>
              {image.price &&
                (<p className={styles.title}>{image.price}</p>)}
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
                    <button onClick={() => deleteImage(image.id, image.cloudinaryId)} className={styles.button}>
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