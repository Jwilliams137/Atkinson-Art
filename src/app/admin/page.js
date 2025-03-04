"use client";
import React, { useState, useEffect } from "react";
import ContentUpload from "../../components/ContentUpload/ContentUpload";
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
import AdminLogin from "../../components/AdminLogin/AdminLogin";
import AdminImageDisplay from "../../components/AdminImageDisplay/AdminImageDisplay";
import AdminTextDisplay from "../../components/AdminTextDisplay/AdminTextDisplay";
import styles from "./page.module.css";
import adminData from "../../data/admin.json";
import { auth } from "../../utils/firebase";
import { getFirestore, collection, query, where, getDocs, doc, writeBatch, addDoc } from "firebase/firestore";

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
    setActiveSection(localStorage.getItem("activeSection") || "home");
  }, []);

  useEffect(() => {
    localStorage.setItem("activeSection", activeSection);
    fetchImagesByPageType(activeSection);
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

  const fetchImagesByPageType = async (pageType) => {
    try {
      const q = query(collection(db, "uploads"), where("pageType", "==", pageType));
      const querySnapshot = await getDocs(q);
      const fetchedImages = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setImages(fetchedImages.sort((a, b) => (a.order || 0) - (b.order || 0)));
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleImageUpload = async (newImage) => {
    try {
      const q = query(collection(db, "uploads"), where("pageType", "==", activeSection));
      const querySnapshot = await getDocs(q);
      const maxOrder = querySnapshot.docs.length > 0 ? Math.max(...querySnapshot.docs.map(doc => doc.data().order || 0)) : 0;
      newImage.order = maxOrder + 1;
      const docRef = await addDoc(collection(db, "uploads"), newImage);
      setImages([...images, { id: docRef.id, ...newImage }].sort((a, b) => a.order - b.order));
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
      if (response.ok) {
        setImages(images.filter((image) => image.id !== imageId));
      } else {
        console.error("Error deleting image:", await response.json());
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const reorderImages = async (index, direction) => {
    if (!isAdmin || (direction === -1 && index === 0) || (direction === 1 && index === images.length - 1)) return;
    const newImages = [...images];
    const swapIndex = index + direction;
    [newImages[index], newImages[swapIndex]] = [newImages[swapIndex], newImages[index]];
    newImages[index].order = index;
    newImages[swapIndex].order = swapIndex;

    setImages([...newImages]);
    const batch = writeBatch(db);
    batch.update(doc(db, "uploads", newImages[index].id), { order: newImages[index].order });
    batch.update(doc(db, "uploads", newImages[swapIndex].id), { order: newImages[swapIndex].order });
    await batch.commit();
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
            {fieldsForPage[activeSection] && (
              <ContentUpload
                onUpload={handleImageUpload}
                sectionData={{ fieldsForPage: { [activeSection]: fieldsForPage[activeSection] }, sections: adminData.sections }}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                deleteImage={deleteImage}
                moveImageUp={(id, index) => reorderImages(index, -1)}
                moveImageDown={(id, index) => reorderImages(index, 1)}
              />
            )}
            <AdminImageDisplay
              images={images}
              deleteImage={deleteImage}
              moveImageUp={(id, index) => reorderImages(index, -1)}
              moveImageDown={(id, index) => reorderImages(index, 1)}
            />
            <AdminTextDisplay />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;