import Image from "next/image";
import styles from "./ImageGallery.module.css";

const ImageGallery = ({ images, className, cardClass, imageClass }) => {
    console.log("Gallery Container Class:", className);
  console.log("Gallery Card Class:", cardClass);
  console.log("Gallery Image Class:", imageClass);
  return (
    <div className={`${styles.galleryContainer} ${className}`}>
      {images.length === 0 ? (
        <div>Loading...</div>
      ) : (
        images.map((image) => (
            <div className={cardClass || styles.galleryCard}>
            <div className={styles.imageWrapper}>
              <Image
                className={imageClass || styles.galleryImage}
                src={image.imageUrl}
                alt={image.title || "Gallery Image"}
                width={image.width || 500}
                height={image.height || 500}
                priority
              />
            </div>
          </div>
          
        ))
      )}
    </div>
  );
};

export default ImageGallery;