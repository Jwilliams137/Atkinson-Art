'use client'
import { useState, useEffect } from 'react';
import { db } from '../../utils/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';
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
          if (data.title && data.imageUrl && data.color && data.width && data.height) {
            fetchedImages.push(data);
          }
        });
        
        const sortedImages = sortImagesByPageLinks(fetchedImages);
        setImages(sortedImages);
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

  const sortImagesByPageLinks = (images) => {
    const pageLinkTitles = Object.keys(pageLinks);
    return images.sort((a, b) => {
      return pageLinkTitles.indexOf(a.title) - pageLinkTitles.indexOf(b.title);
    });
  };

  return (
    <div className={styles.artworkContainer}>      
        {images.map((image, index) => {
          const pageLink = pageLinks[image.title];

          if (!pageLink) {
            console.warn(`No page link found for image title: ${image.title}`);
            return null;
          }

          const visibleTitle = image.title.replace('Click to visit the ', '').replace(' page', '').toLowerCase();

          return (
            <div key={index} className={styles.artworkItem}>
              <Link href={pageLink} passHref className={styles.desktopView}>
                <div className={styles.flipCard}>
                  <div className={styles.flipCardInner}>
                    <div className={styles.flipCardFront}>
                      <Image 
                        src={image.imageUrl} 
                        alt={image.title} 
                        className={styles.artworkImage}
                        width={image.width}
                        height={image.height}
                        layout="intrinsic"
                      />
                    </div>
                    <div className={styles.flipCardBack} style={{ backgroundColor: image.color }}>
                      <p>{visibleTitle}</p>
                    </div>
                  </div>
                </div>
              </Link>

              <div className={styles.mobileView}>
                <div className={styles.mobileFlipCard}>
                  <div className={styles.mobileFlipCardInner}>
                    <div className={styles.mobileFlipCardFront}>
                      <Image 
                        src={image.imageUrl} 
                        alt={image.title} 
                        className={styles.mobileArtworkImage}
                        width={image.width}
                        height={image.height}
                        layout="intrinsic"
                      />
                    </div>
                    <div className={styles.mobileFlipCardBack} style={{ backgroundColor: image.color }}>
                      <Link href={pageLink} passHref>
                        <p>{visibleTitle}</p>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default ArtworkPage;