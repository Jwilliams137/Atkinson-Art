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
    if (adminEmails.length === 0) return;

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user || null);
      setIsAdmin(user ? adminEmails.includes(user.email) : false);
    });

    return () => unsubscribe();
  }, [adminEmails]); // Now only updates when `adminEmails` changes.

  useEffect(() => {
    if (!activeSection) return;

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
  }, [activeSection]); // Removed `db` from dependencies to prevent unnecessary re-fetching.

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

  const handleSubmit = async (uploadType, sectionKey) => {
    console.log(`Submitting ${uploadType} for section: ${sectionKey}`);

    if (uploadType === "image-upload" && selectedImage) {
      const formData = new FormData();
      formData.append("file", selectedImage);
      formData.append("section", sectionKey);

      try {
        const response = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        if (response.ok) {
          console.log("Upload successful:", result);
          alert("Image uploaded successfully!");
          setSelectedImage(null);
        } else {
          console.error("Upload failed:", result.error);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    } else if (uploadType === "text-upload") {
      alert("Text upload feature needs to be implemented!");
    }
  };

  return (
    <div className={styles.adminPage}>
      <div className={styles.adminTopSection}>
        <AdminLogin />
      </div>

      {user && isAdmin ? (
        <div className={styles.adminContentWrapper}>
          <AdminSidebar setActiveSection={setActiveSection} />
          <div className={styles.adminMainContent}>
            {fieldsForPage[activeSection] && (
              <UploadContent
                sectionData={{
                  fieldsForPage: { [activeSection]: fieldsForPage[activeSection] },
                  sections: adminData.sections,
                }}
                handleSubmit={handleSubmit}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
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
      ) : (
        <p>Access Denied</p>
      )}
    </div>
  );
};

export default AdminPage;
