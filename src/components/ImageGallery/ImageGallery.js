import Image from "next/image";
import styles from "./ImageGallery.module.css";

const ImageGallery = ({ images, className }) => {
  return (
    <div className={`${styles.galleryContainer} ${className}`}>
      {images.length === 0 ? (
        <div>Loading...</div>
      ) : (
        images.map((image) => (
          <div key={image.id} className={styles.galleryCard}>
            <Image
              className={styles.galleryImage}
              src={image.imageUrl}
              alt={image.title || "Gallery Image"}
              width={image.width || 500}
              height={image.height || 500}
              priority
            />
          </div>
        ))
      )}
    </div>
  );
};

export default ImageGallery;