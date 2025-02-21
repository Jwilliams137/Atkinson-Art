"use client";
import { useEffect, useState } from "react";
import { getFirestore, collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { app } from "../../utils/firebase";
import styles from "./page.module.css";
import Image from "next/image";

const db = getFirestore(app);

const ShopPage = () => {
  const [shopItems, setShopItems] = useState([]);

  useEffect(() => {
    const fetchShopItems = async () => {
      try {
        const q = query(
          collection(db, "uploads"),
          where("pageType", "==", "shop"), // Use "shop" as the pageType
          orderBy("order") // Order items by the 'order' field
        );
        const querySnapshot = await getDocs(q);

        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setShopItems(items);
      } catch (error) {
        console.error("Error fetching shop items:", error);
      }
    };

    fetchShopItems();
  }, []);

  if (shopItems.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.shopContainer}>
      {shopItems.map((item) => (
        <div key={item.id} className={styles.shopCard}>
          <Image
            className={styles.shopImage}
            src={item.imageUrl}
            alt={item.title || "Shop Item"}
            width={item.width || 500} // Default width
            height={item.height || 500} // Default height
            priority
          />
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <p><strong>${item.price}</strong></p>
        </div>
      ))}
    </div>
  );
};

export default ShopPage;

