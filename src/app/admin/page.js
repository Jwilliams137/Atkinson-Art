'use client'
import React, { useState, useEffect } from "react";
import ContentUpload from "../../components/ContentUpload/ContentUpload";
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
import AdminLogin from "../../components/AdminLogin/AdminLogin";
import AdminImageDisplay from "../../components/AdminImageDisplay/AdminImageDisplay";
import AdminTextDisplay from "../../components/AdminTextDisplay/AdminTextDisplay";
import styles from "./page.module.css";
import adminData from "../../data/admin.json";
import useAuth from "../../hooks/useAuth";
import { getFirestore, collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from "firebase/firestore";

const AdminPage = () => {
  const { user, isUserAllowed } = useAuth();
  const [activeSection, setActiveSection] = useState("home");
  const [fieldsForPage, setFieldsForPage] = useState({});
  const [images, setImages] = useState([]);
  const [texts, setTexts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const db = getFirestore();

  useEffect(() => {
    setFieldsForPage(adminData.fieldsForPage);
    setActiveSection(localStorage.getItem("activeSection") || "home");
  }, []);

  useEffect(() => {
    localStorage.setItem("activeSection", activeSection);
    fetchTextsByPageType(activeSection);
  
    const q = query(collection(db, "uploads"), where("pageType", "==", activeSection));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedImages = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setImages(fetchedImages.sort((a, b) => (a.order || 0) - (b.order || 0)));
    });
  
    return () => unsubscribe();
  }, [activeSection]);
  
  const fetchTextsByPageType = async (pageType) => {
    try {
      const q = query(collection(db, "textUploads"), where("pageType", "==", pageType));
      const querySnapshot = await getDocs(q);
      const fetchedTexts = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTexts(fetchedTexts);
    } catch (error) {
      console.error("Error fetching texts:", error);
    }
  };

  const deleteText = async (id) => {
    try {
      await deleteDoc(doc(db, "textUploads", id));
      setTexts(texts.filter((text) => text.id !== id));
    } catch (error) {
      console.error("Error deleting text:", error);
    }
  };

  const moveTextUp = async (id, index) => {
    if (index > 0) {
      const newTexts = [...texts];
      const temp = newTexts[index];
      newTexts[index] = newTexts[index - 1];
      newTexts[index - 1] = temp;
      setTexts(newTexts);
      await updateTextOrder(newTexts);
    }
  };

  const moveTextDown = async (id, index) => {
    if (index < texts.length - 1) {
      const newTexts = [...texts];
      const temp = newTexts[index];
      newTexts[index] = newTexts[index + 1];
      newTexts[index + 1] = temp;
      setTexts(newTexts);
      await updateTextOrder(newTexts);
    }
  };

  const updateTextOrder = async (newTexts) => {
    try {
      for (let i = 0; i < newTexts.length; i++) {
        const textRef = doc(db, "textUploads", newTexts[i].id);
        await updateDoc(textRef, { order: i });
      }
    } catch (error) {
      console.error("Error updating text order:", error);
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
            <div className={styles.adminDisplay}>
              <AdminImageDisplay images={images} setImages={setImages} isAdmin={isUserAllowed} />
              <AdminTextDisplay
                texts={texts} 
                deleteText={deleteText} 
                moveTextUp={moveTextUp} 
                moveTextDown={moveTextDown}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;

