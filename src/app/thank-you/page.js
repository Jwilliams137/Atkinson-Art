'use client'
import { useEffect, useState } from 'react';
import { db } from '../../utils/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Image from 'next/image';
import styles from './page.module.css';

const fixCloudinaryUrl = (url) =>
  url.includes("/upload/") ? url.replace("/upload/", "/upload/a_exif/") : url;

function ThankYouPage() {
  const [randomImage, setRandomImage] = useState(null);

  useEffect(() => {
    const fetchRandomImage = async () => {
      try {
        const q = query(collection(db, 'uploads'), where('pageType', '==', 'artwork'));
        const querySnapshot = await getDocs(q);

        const images = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();

          const displayImage =
            data.imageUrls?.length && data.imageUrls[0]?.url
              ? {
                imageUrl: data.imageUrls[0].url,
                width: data.imageUrls[0].width,
                height: data.imageUrls[0].height,
              }
              : data.imageUrl && data.width && data.height
                ? {
                  imageUrl: data.imageUrl,
                  width: data.width,
                  height: data.height,
                }
                : null;

          if (displayImage) {
            images.push(displayImage);
          }
        });

        if (images.length > 0) {
          const randomIndex = Math.floor(Math.random() * images.length);
          setRandomImage(images[randomIndex]);
        } else {
          console.log('No matching images found.');
        }
      } catch (error) {
        console.error('Error fetching images:', error);
        alert('Something went wrong while fetching images.');
      }
    };

    fetchRandomImage();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.thanks}>
        <h1>Thank You!</h1>
        <p className={styles.success}>
          Your message has been sent. I will get back to you as soon as possible.
        </p>
      </div>

      {randomImage && (
        <div className={styles.imageContainer}>
          <Image
            src={fixCloudinaryUrl(randomImage.imageUrl)}
            alt="Artwork by Linda Atkinson"
            className={styles.randomImage}
            width={randomImage.width}
            height={randomImage.height}
          />
        </div>
      )}
    </div>
  );
}

export default ThankYouPage;