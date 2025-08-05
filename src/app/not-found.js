'use client';

import { useEffect, useState } from 'react';
import { db } from '../utils/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Image from 'next/image';
import styles from './not-found.module.css';

const fixCloudinaryUrl = (url) =>
  url.includes('/upload/') ? url.replace('/upload/', '/upload/a_exif/') : url;

export default function NotFound() {
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
        }
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    fetchRandomImage();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.message}>
        <h1>Page Not Found</h1>
        <p className={styles.text}>Sorry, we couldn’t find that page.</p>
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