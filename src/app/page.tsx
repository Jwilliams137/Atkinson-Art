'use client';
import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../../utils/firebase";
import styles from "./page.module.css";
import Image from "next/image";

const db = getFirestore(app);

// Define the shape of your homeData
interface HomePageData {
  title: string;
  imageUrl: string;
}

const HomePage = () => {
  const [homeData, setHomeData] = useState<HomePageData | null>(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const docRef = doc(db, "home", "homePage");  // Adjust if you store the home page differently
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setHomeData(docSnap.data() as HomePageData); // Typecast the result to HomePageData
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching home page data:", error);
      }
    };

    fetchHomeData();
  }, []);

  if (!homeData) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.homePageContainer}>
      <Image
        src={homeData.imageUrl}
        alt={homeData.title}
        width={800}
        height={600}
        priority
      />
    </div>
  );
};

export default HomePage;
