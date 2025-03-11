'use client'
import { useState, useEffect } from 'react';
import { db } from '../../utils/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';
import useTextUploads from "../../hooks/useTextUploads";
import TextSection from "../../components/TextSection/TextSection";
import styles from './page.module.css';

// Move sortImagesByPageLinks function outside the component
const sortImagesByPageLinks = (images, pageLinks) => {
  const pageLinkTitles = Object.keys(pageLinks);
  return images.sort((a, b) => {
    return pageLinkTitles.indexOf(a.title) - pageLinkTitles.indexOf(b.title);
  });
};

const ArtworkPage = () => {
  const [images, setImages] = useState([]);
  const artworkTextUploads = useTextUploads("artwork");

  // Define pageLinks inside the component
  const pageLinks = {
    'Click to visit the New Work page': '/artwork/new-work',
    'Click to visit the Houses page': '/artwork/houses',
    'Click to visit the Constructions page': '/artwork/constructions',
    'Click to visit the Collage page': '/artwork/collage',
    'Click to visit the Earlier Work page': '/artwork/earlier-work'
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'uploads'));
        const fetchedImages = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.title && data.imageUrl && data.color && data.width && data.height) {
            fetchedImages.push({ ...data, id: doc.id });
          }
        });

        const sortedImages = sortImagesByPageLinks(fetchedImages, pageLinks);
        setImages(sortedImages);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);  // No need to include sortImagesByPageLinks in the dependency array

  return (
    <div className={styles.artworkPage}>
      <div className={styles.artworkContainer}>
        {images.map((image) => {
          const pageLink = pageLinks[image.title];

          if (!pageLink) {
            console.warn(`No page link found for image title: ${image.title}`);
            return null;
          }

          const visibleTitle = image.title.replace('Click to visit the ', '').replace(' page', '');

          return (
            <div key={image.id} className={styles.artworkItem}>
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
                      <p>
                        <Link href={pageLink} passHref>
                          {visibleTitle}
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles.text}>
        <TextSection
          textUploads={artworkTextUploads}
          containerClass={styles.artworkTextContainer}
          sectionClass={styles.artworkTextSection}
          textClass={styles.artworkText}
        />
      </div>
    </div>
  );
};

export default ArtworkPage;