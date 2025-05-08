'use client'
import { useState, useEffect, useMemo } from 'react';
import { db } from '../../utils/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';
import useTextUploads from "../../hooks/useTextUploads";
import TextSection from "../../components/TextSection/TextSection";
import styles from './page.module.css';

const sortImagesByPageLinks = (images, pageLinks) => {
  const pageLinkTitles = Object.keys(pageLinks);
  return images.sort((a, b) => {
    return pageLinkTitles.indexOf(a.title) - pageLinkTitles.indexOf(b.title);
  });
};

const ArtworkPage = () => {
  const [images, setImages] = useState([]);
  const artworkTextUploads = useTextUploads("artwork");

  const pageLinks = useMemo(() => ({
    'Click to visit the New Work page': '/artwork/new-work',
    'Click to visit the Houses page': '/artwork/houses',
    'Click to visit the Tiny Houses page': '/artwork/tiny-houses',
    'Click to visit the Constructions page': '/artwork/constructions',
    'Click to visit the Commissions page': '/artwork/commissions',
    'Click to visit the Collage page': '/artwork/collage',
    'Click to visit the Earlier Work page': '/artwork/earlier-work'
  }), []);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const q = query(collection(db, 'uploads'), where("pageType", "==", "artwork"));
        const querySnapshot = await getDocs(q);
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
  }, [pageLinks]);

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
                        style={{ width: "100%", height: "auto" }}
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
        />
      </div>
    </div>
  );
};

export default ArtworkPage;