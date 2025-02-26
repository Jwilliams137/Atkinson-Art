"use client";
import { useState, useEffect } from "react";
import UploadContent from "../../components/UploadContent/UploadContent";
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
import AdminLogin from "../../components/AdminLogin/AdminLogin";
import AdminDisplay from "../../components/AdminDisplay/AdminDisplay";
import styles from "./page.module.css";
import adminData from "../../data/admin.json";
import { auth } from "../../utils/firebase";
import { getFirestore, collection, query, where, getDocs, doc, writeBatch } from "firebase/firestore";

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [fieldsForPage, setFieldsForPage] = useState({});
  const [user, setUser] = useState(null);
  const [images, setImages] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmails, setAdminEmails] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const db = getFirestore();

  useEffect(() => {
    setFieldsForPage(adminData.fieldsForPage);
    const savedSection = localStorage.getItem("activeSection");
    if (savedSection) {
      setActiveSection(savedSection);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("activeSection", activeSection);
  }, [activeSection]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user || null);
      if (user && adminEmails.length > 0) {
        setIsAdmin(adminEmails.includes(user.email));
      }
    });
    return () => unsubscribe();
  }, [adminEmails]);

  useEffect(() => {
    const fetchAdminEmails = async () => {
      try {
        const response = await fetch("/api/restricted-users");
        const data = await response.json();
        setAdminEmails(data.restrictedUsers || []);
      } catch (error) {
        console.error("Failed to fetch admin emails:", error);
      }
    };
    fetchAdminEmails();
  }, []);

  useEffect(() => {
    const fetchImagesByPageType = async (pageType) => {
      try {
        const imagesCollection = collection(db, "uploads");
        const q = query(imagesCollection, where("pageType", "==", pageType));
        const querySnapshot = await getDocs(q);

        const fetchedImages = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const sortedImages = fetchedImages.sort((a, b) => (a.order || 0) - (b.order || 0));
        setImages(sortedImages);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImagesByPageType(activeSection);
  }, [activeSection, db]);

  const handleImageUpload = async (newImage) => {
    try {
      const imagesCollection = collection(db, "uploads");
      const q = query(imagesCollection, where("pageType", "==", activeSection));
      const querySnapshot = await getDocs(q);
      const existingImages = querySnapshot.docs.map(doc => doc.data());
      const maxOrder = existingImages.length > 0 ? Math.max(...existingImages.map(img => img.order || 0)) : 0;
      newImage.order = maxOrder + 1;
      const docRef = await addDoc(imagesCollection, newImage);

      setImages((prevImages) => [...prevImages, { ...newImage, id: docRef.id }]);

    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const deleteImage = async (imageId, cloudinaryId) => {
    if (!isAdmin) return;
    try {
      const response = await fetch("/api/delete-image", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cloudinaryId, imageId }),
      });

      const result = await response.json();

      if (response.ok) {
        setImages((prevImages) => prevImages.filter((image) => image.id !== imageId));
      } else {
        console.error("Error deleting image:", result.error);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const moveImageUp = async (imageId, index) => {
    if (!isAdmin || index === 0) return;

    const prevImage = images[index - 1];
    const currentImage = images[index];
    const batch = writeBatch(db);
    const currentImageRef = doc(db, "uploads", currentImage.id);
    const prevImageRef = doc(db, "uploads", prevImage.id);

    batch.update(currentImageRef, { order: prevImage.order });
    batch.update(prevImageRef, { order: currentImage.order });

    await batch.commit();

    const updatedImages = [...images];
    updatedImages[index - 1] = currentImage;
    updatedImages[index] = prevImage;

    setImages(updatedImages);
  };

  const moveImageDown = async (imageId, index) => {
    if (!isAdmin || index === images.length - 1) return;

    const nextImage = images[index + 1];
    const currentImage = images[index];
    const batch = writeBatch(db);
    const currentImageRef = doc(db, "uploads", currentImage.id);
    const nextImageRef = doc(db, "uploads", nextImage.id);

    batch.update(currentImageRef, { order: nextImage.order });
    batch.update(nextImageRef, { order: currentImage.order });

    await batch.commit();

    const updatedImages = [...images];
    updatedImages[index + 1] = currentImage;
    updatedImages[index] = nextImage;

    setImages(updatedImages);
  };

  return (
    <div className={styles.adminPage}>
      <div className={styles.adminTopSection}>
        <AdminLogin />
      </div>

      {user && isAdmin && (
        <div className={styles.adminContentWrapper}>
          <AdminSidebar setActiveSection={setActiveSection} />
          <div className={styles.adminMainContent}>
            <p className={styles.reminder}>Reminder: Always add a title to every image even if one isn't supposed to appear visibly on the site.
              This helps people who use screen readers and it has benefits for search engine optimization.</p>
            {fieldsForPage[activeSection] && (
              <UploadContent onUpload={handleImageUpload}
                sectionData={{
                  fieldsForPage: { [activeSection]: fieldsForPage[activeSection] },
                  sections: adminData.sections,
                }}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                deleteImage={deleteImage}
                moveImageUp={moveImageUp}
                moveImageDown={moveImageDown}
              />
            )}

            <AdminDisplay
              images={images}
              deleteImage={deleteImage}
              moveImageUp={moveImageUp}
              moveImageDown={moveImageDown}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;