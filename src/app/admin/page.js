"use client";
import React, { useState, useEffect } from "react";
import ContentUpload from "../../components/ContentUpload/ContentUpload";
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
import AdminLogin from "../../components/AdminLogin/AdminLogin";
import AdminImageDisplay from "../../components/AdminImageDisplay/AdminImageDisplay";
import AdminTextDisplay from "../../components/AdminTextDisplay/AdminTextDisplay";
import styles from "./page.module.css";
import adminData from "../../data/admin.json";
import useAuth from "../../hooks/useAuth";
import { getFirestore, collection, query, where, getDocs, addDoc } from "firebase/firestore";

const AdminPage = () => {
  const { user, isUserAllowed } = useAuth();
  const [activeSection, setActiveSection] = useState("home");
  const [fieldsForPage, setFieldsForPage] = useState({});
  const [images, setImages] = useState([]);
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

  return (
    <div className={styles.adminPage}>
      <div className={styles.adminTopSection}>
        <AdminLogin />
      </div>
      {user && isUserAllowed && (
        <div className={styles.adminContentWrapper}>
          <AdminSidebar setActiveSection={setActiveSection} />
          <div className={styles.adminMainContent}>
            {fieldsForPage[activeSection] && (
              <ContentUpload
                onUpload={handleImageUpload}
                sectionData={{ fieldsForPage: { [activeSection]: fieldsForPage[activeSection] }, sections: adminData.sections }}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
              />
            )}
            <AdminImageDisplay images={images} setImages={setImages} isAdmin={isUserAllowed} />
            <AdminTextDisplay />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;