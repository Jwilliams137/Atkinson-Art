"use client";
import Image from "next/image";
import styles from "./AdminDisplay.module.css";

const AdminDisplay = ({ images }) => {
  return (
    <div className={styles.imagesGrid}>
      {images.length > 0 ? (
        images.map((image, index) => (
          <div key={index} className={styles.imageItem}>
            <Image
              src={image.imageUrl}
              alt={image.title || "Uploaded Image"}
              width={image.width || 300}
              height={image.height || 200}
            />
          </div>
        ))
      ) : (
        <p>No images found for this section.</p>
      )}
    </div>
  );
};

export default AdminDisplay;