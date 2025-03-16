"use client";
import Image from "next/image";
import { getFirestore, doc, writeBatch } from "firebase/firestore";
import styles from "./AdminImageDisplay.module.css";

const AdminImageDisplay = ({ images, setImages, isAdmin, activeSection }) => {
  const db = getFirestore();

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
    batch.update(doc(db, "uploads", newImages[index].id), { order: newImages[index].order });
    batch.update(doc(db, "uploads", newImages[swapIndex].id), { order: newImages[swapIndex].order });
    await batch.commit();
  };

  return (
    <div className={styles.imagesGrid}>
      {images.map((image, index) => (
        <div key={image.id || index} className={styles.imageItem}>
          <Image
            src={image.imageUrl}
            alt={image.title || "Uploaded Image"}
            width={image.width || 300}
            height={image.height || 200}
          />
          <p className={styles.title} style={{ border: `4px solid ${image.color}` }}>{image.title}</p>
          {activeSection !== "artwork" && (
          <div className={styles.reorderButtons}>
            {index > 0 && (
              <button onClick={() => reorderImages(index, -1)} className={styles.moveButton}>
                ▲
              </button>
            )}
            {index < images.length - 1 && (
              <button onClick={() => reorderImages(index, 1)} className={styles.moveButton}>
                ▼
              </button>
            )}
          </div>
          )}
          <button
            onClick={() => deleteImage(image.id, image.cloudinaryId)}
            className={styles.deleteButton}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminImageDisplay;