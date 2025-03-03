"use client";
import React from 'react';
import Image from "next/image";
import styles from "./AdminImageDisplay.module.css";

const AdminImageDisplay = ({ images, deleteImage, moveImageUp, moveImageDown }) => {
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
      }
    </div>
  );
};

export default AdminImageDisplay;