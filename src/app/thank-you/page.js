'use client'
import React, { useEffect, useState } from 'react';
import { db } from '../../utils/firebase'; 
import { collection, query, where, getDocs } from 'firebase/firestore';
import Image from 'next/image';  
import styles from './page.module.css';

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
          if (data.imageUrl && data.width && data.height) {
            images.push(data);
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
        <header>
          <h1>Thank You!</h1>
        </header>
        <p className={styles.success}>
          Your message has been sent. I will get back to you as soon as possible.
        </p>
      </div>
      
      {randomImage && (
        <div className={styles.imageContainer}>
          <Image
            src={randomImage.imageUrl}  
            alt="Random Artwork"
            className={styles.randomImage}
            width={randomImage.width}  
            height={randomImage.height} 
            layout="intrinsic"
          />
        </div>
      )}
    </div>
  );
}

export default ThankYouPage;