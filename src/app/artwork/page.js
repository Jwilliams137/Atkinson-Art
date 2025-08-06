'use client';
import { useState, useEffect, useMemo } from 'react';
import { db } from '../../utils/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';
import useTextUploads from "../../hooks/useTextUploads";
import TextSection from "../../components/TextSection/TextSection";
import styles from './page.module.css';

const fixCloudinaryUrl = (url) =>
  url.includes("/upload/") ? url.replace("/upload/", "/upload/a_exif/") : url;

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
          if (data.title && data.color) {
            let image = {
              title: data.title,
              color: data.color,
              id: doc.id,
            };

            if (data.imageUrls && data.imageUrls.length > 0) {
              const firstImage = data.imageUrls[0];
              image.imageUrl = firstImage.url;
              image.width = firstImage.width;
              image.height = firstImage.height;
            } else if (data.imageUrl && data.width && data.height) {
              image.imageUrl = data.imageUrl;
              image.width = data.width;
              image.height = data.height;
            } else {
              console.warn("No usable image format found for document:", doc.id);
              return;
            }

            fetchedImages.push(image);
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
      <h1 className={styles.visuallyHidden}>Artwork by Linda Atkinson</h1>
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
              <Link href={pageLink} className={styles.desktopView}>
                <div className={styles.flipCard}>
                  <div
                    className={`${styles.flipCardInner} ${!image.imageUrl ? styles.flipped : ""
                      }`}
                  >
                    <div className={styles.flipCardFront}>
                      {image.imageUrl ? (
                        <Image
                          src={fixCloudinaryUrl(image.imageUrl)}
                          alt={image.title}
                          className={styles.artworkImage}
                          width={image.width}
                          height={image.height}
                        />
                      ) : (
                        <div
                          className={styles.flipCardBack}
                          style={{ backgroundColor: image.color }}
                        >
                          <p>{visibleTitle}</p>
                        </div>
                      )}
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
                      {image.imageUrl ? (
                        <Image
                          src={fixCloudinaryUrl(image.imageUrl)}
                          alt={image.title}
                          className={styles.artworkImage}
                          width={image.width}
                          height={image.height}
                        />
                      ) : (
                        <div
                          className={styles.flipCardBack}
                          style={{ backgroundColor: image.color }}
                        >
                          <p>{visibleTitle}</p>
                        </div>
                      )}
                    </div>
                    <div className={styles.mobileFlipCardBack} style={{ backgroundColor: image.color }}>
                      <p>
                        <Link href={pageLink}>{visibleTitle}</Link>
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
        <TextSection textUploads={artworkTextUploads} />
      </div>
    </div>
  );
};

export default ArtworkPage;