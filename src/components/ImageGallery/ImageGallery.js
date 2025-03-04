import React from 'react';
import Image from "next/image";
import styles from "./ImageGallery.module.css";

const ImageGallery = ({ images, className, cardClass, imageClass, onImageClick = () => { } }) => {
  console.log("Gallery Container Class:", className);
  console.log("Gallery Card Class:", cardClass);
  console.log("Gallery Image Class:", imageClass);

  return (
    <div className={`${styles.galleryContainer} ${className}`}>
      {images?.map((image, index) => (
        <div key={image.id || index} className={cardClass ? cardClass : styles.galleryCard}>
          <div className={styles.imageWrapper}>
            <Image
              className={imageClass || styles.galleryImage}
              src={image.imageUrl}
              alt={image.title || "Gallery Image"}
              width={image.width || 500}
              height={image.height || 500}
              priority
              onClick={() => onImageClick(index)}
            />
          </div>
          <div className={styles.mobileLabel}>
            <p className={styles.mobileTitle}>{image.title}</p>
            <p>{image.description}</p>
            <p>{image.dimensions}</p>
            <p>{image.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
