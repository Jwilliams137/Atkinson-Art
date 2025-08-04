'use client'
import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import adminData from "../../data/admin.json";
import AdminLogin from "../../components/AdminLogin/AdminLogin";
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
import { getFirestore, collection, query, where, getDocs, addDoc, onSnapshot } from "firebase/firestore";
import ContentUpload from "../../components/ContentUpload/ContentUpload";
import AdminImageDisplay from "../../components/AdminImageDisplay/AdminImageDisplay";
import AdminTextDisplay from "../../components/AdminTextDisplay/AdminTextDisplay";
import AdminNotes from '../../components/AdminNotes/AdminNotes';
import styles from "./page.module.css";
import ExhibitionAdminTextDisplay from "../../components/ExhibitionAdminTextDsiplay/ExhibitionAdminTextDisplay";

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
    const db = getFirestore();

    localStorage.setItem("activeSection", activeSection);

    const imageQuery = query(collection(db, "uploads"), where("pageType", "==", activeSection));
    const unsubscribeImages = onSnapshot(imageQuery, (querySnapshot) => {
      const fetchedImages = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setImages(fetchedImages.sort((a, b) => (a.order || 0) - (b.order || 0)));
    });

    const textQuery = query(collection(db, "textUploads"), where("pageType", "==", activeSection));
    const unsubscribeTexts = onSnapshot(textQuery, (querySnapshot) => {
      const fetchedTexts = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTexts(fetchedTexts.sort((a, b) => (a.order || 0) - (b.order || 0)));
    });

    return () => {
      unsubscribeImages();
      unsubscribeTexts();
    };
  }, [activeSection]);

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
          <AdminSidebar
            setActiveSection={setActiveSection}
          />
          <div className={styles.adminMainContent}>
            <h2 className={styles.section}>Edit content for {activeSection}</h2>
            <div className={styles.notes}>
              <AdminNotes
                section={activeSection}
                fieldsForPage={fieldsForPage}
              />
            </div>
            {fieldsForPage[activeSection] && (
              <ContentUpload
                onUpload={handleImageUpload}
                sectionData={{ fieldsForPage: { [activeSection]: fieldsForPage[activeSection] }, sections: adminData.sections }}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
              />
            )}
            <div className={styles.adminDisplay}>
              <AdminImageDisplay
                images={images}
                setImages={setImages}
                isAdmin={isUserAllowed}
                activeSection={activeSection}
              />
              {activeSection === "exhibitions" ? (
                <ExhibitionAdminTextDisplay texts={texts} setTexts={setTexts} db={db} />
              ) : (
                <AdminTextDisplay texts={texts} setTexts={setTexts} db={db} />
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;