"use client";
import { useState, useEffect } from "react";
import UploadImage from "../../components/UploadImage/UploadImage";
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
import AdminLogin from "../../components/AdminLogin/AdminLogin";
import AdminDisplay from "../../components/AdminDisplay/AdminDisplay";
import styles from "./page.module.css";
import adminData from "../../data/admin.json";
import { auth } from "../../../utils/firebase";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [fieldsForPage, setFieldsForPage] = useState({});
  const [user, setUser] = useState(null);
  const [images, setImages] = useState([]);

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
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (activeSection) {
      fetchImagesByPageType(activeSection);
    }
  }, [activeSection]);

  const fetchImagesByPageType = async (pageType) => {
    const imagesCollection = collection(db, "uploads");
    const q = query(imagesCollection, where("pageType", "==", pageType));

    const querySnapshot = await getDocs(q);
    const fetchedImages = querySnapshot.docs.map(doc => doc.data());
    setImages(fetchedImages);
  };

  const handleImageUpload = (newImage) => {
    setImages((prevImages) => [newImage, ...prevImages]);
  };

  return (
    <div className={styles.adminPage}>
      <div className={styles.adminTopSection}>
        <AdminLogin />
      </div>

      {user && (
        <div className={styles.adminContentWrapper}>
          <AdminSidebar setActiveSection={setActiveSection} />
          <div className={styles.adminMainContent}>
            {fieldsForPage[activeSection] && (
              <UploadImage pageType={activeSection} fields={fieldsForPage[activeSection]} onUpload={handleImageUpload} />
            )}
            <AdminDisplay images={images} activeSection={activeSection} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;