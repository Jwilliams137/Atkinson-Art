"use client";
import Image from "next/image";
import styles from "./AdminDisplay.module.css";

const AdminDisplay = ({ images, deleteImage, moveImageUp, moveImageDown }) => {
  return (
    <div className={styles.imagesGrid}>
      {images.length > 0 ? (
        images.map((image, index) => (
          <div key={image.id || index} className={styles.imageItem}>
            <Image
              src={image.imageUrl}
              alt={image.title || "Uploaded Image"}
              width={image.width || 300}
              height={image.height || 200}
            />
            <button
              onClick={() => deleteImage(image.id, image.cloudinaryId)}
              className={styles.deleteButton}
            >
              Delete
            </button>
            <div className={styles.reorderButtons}>
              {index > 0 && (
                <button
                  onClick={() => moveImageUp(image.id, index)}
                  className={styles.moveButton}
                >
                  Move Up
                </button>
              )}
              {index < images.length - 1 && (
                <button
                  onClick={() => moveImageDown(image.id, index)}
                  className={styles.moveButton}
                >
                  Move Down
                </button>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>No images found for this section.</p>
      )}
    </div>
  );
};

export default AdminDisplay;

