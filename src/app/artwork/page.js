'use client'

import { useState, useEffect } from 'react';
import { db } from '../../utils/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import styles from './page.module.css';

const ArtworkPage = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'uploads'));
        const fetchedImages = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.title && data.imageUrl) {
            fetchedImages.push(data);
          }
        });
        
        setImages(fetchedImages);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  const pageLinks = {
    'Click to visit the New Work page': '/artwork/new-work',
    'Click to visit the Houses page': '/artwork/houses',
    'Click to visit the Constructions page': '/artwork/constructions',
    'Click to visit the Collage page': '/artwork/collage',
    'Click to visit the Earlier Work page': '/artwork/earlier-work'
  };

  return (
    <div className={styles.artworkContainer}>
      {images.length > 0 ? (
        images.map((image, index) => {
          const pageLink = pageLinks[image.title];

          if (!pageLink) {
            console.warn(`No page link found for image title: ${image.title}`);
            return null;
          }

          return (
            <div key={index} className={styles.artworkItem}>
              <Link href={pageLink} passHref>
                <div className={styles.flipCard}>
                  <div className={styles.flipCardInner}>
                    <div className={styles.flipCardFront}>
                      <img src={image.imageUrl} alt={image.title} className={styles.artworkImage} />
                    </div>
                    <div className={styles.flipCardBack}>
                      <p>{image.title.replace('Click to visit the ', '').toLowerCase()}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ArtworkPage;
