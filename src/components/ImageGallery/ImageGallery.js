// ImageGallery.js
import Image from "next/image";
import styles from "./ImageGallery.module.css"; // Import styles from ImageGallery's CSS module

const ImageGallery = ({ images, className, cardClass, imageClass }) => {
  return (
    <div className={`${styles.galleryContainer} ${className}`}>
      {images.length === 0 ? (
        <div>Loading...</div>
      ) : (
        images.map((image) => (
          <div key={image.id} className={cardClass || styles.galleryCard}>
            <Image
              className={imageClass || styles.galleryImage}
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