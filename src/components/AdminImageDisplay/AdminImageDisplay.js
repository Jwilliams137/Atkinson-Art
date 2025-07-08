'use client';
import { useState } from "react";
import Image from "next/image";
import { getFirestore, doc, writeBatch, updateDoc } from "firebase/firestore";
import styles from "./AdminImageDisplay.module.css";
import AdminModal from "../AdminModal/AdminModal";
import config from "../../data/admin.json";

const AdminImageDisplay = ({ images, setImages, isAdmin, activeSection }) => {
  const db = getFirestore();
  const [editingImage, setEditingImage] = useState(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  const excludedFields = [
    "id", "imageUrl", "cloudinaryId", "createdAt", "updatedAt", "order", "width", "height", "type"
  ];

  const toggleDescription = (id) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const deleteImage = async (imageId, cloudinaryIdOrArray) => {
    if (!isAdmin) return;

    const cloudinaryIds = Array.isArray(cloudinaryIdOrArray)
      ? cloudinaryIdOrArray
      : cloudinaryIdOrArray
        ? [cloudinaryIdOrArray]
        : [];

    try {
      const response = await fetch("/api/delete-image", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageId, cloudinaryIds }),
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
    batch.update(doc(db, "uploads", newImages[index].id), { order: index });
    batch.update(doc(db, "uploads", newImages[swapIndex].id), { order: swapIndex });
    await batch.commit();
  };

  const handleEdit = (image) => {
    setEditingImage(image);
  };

  const handleSave = async (updatedFields) => {
    try {
      await updateDoc(doc(db, "uploads", editingImage.id), updatedFields);
      setImages((prev) =>
        prev.map((img) => (img.id === editingImage.id ? { ...img, ...updatedFields } : img))
      );
      setEditingImage(null);
    } catch (error) {
      console.error("Error saving image:", error);
    }
  };

  return (
    <div className={styles.imagesGrid}>
      {images.map((image, index) => {
        const mainImageUrl = image.imageUrls?.[0]?.url || image.imageUrl;
        const isMultiImageEnabled = !config.pageSettings?.[activeSection]?.singleImageOnly;

        return (
          <div key={image.id || index} className={styles.imageItem}>
            {Array.isArray(image.imageUrls) && image.imageUrls.length > 0 ? (
              <>
                <div className={styles.imageGroup}>
                  {(() => {
                    const fallbackImage = image.imageUrls
                      .slice()
                      .sort((a, b) => a.detailOrder - b.detailOrder)
                      .find(img => img.url);

                    const displayImage = image.imageUrls.find(img => img.detailOrder === 0 && img.url) || fallbackImage;

                    return displayImage ? (
                      <Image
                        src={displayImage.url}
                        alt={`${image.title || "Uploaded Image"} - Main View`}
                        width={displayImage.width || 300}
                        height={displayImage.height || 200}
                        style={{
                          marginBottom: "8px",
                          border: activeSection === "artwork" ? `4px solid ${image.color || "#ccc"}` : undefined,
                          borderRadius: "8px",
                        }}
                      />
                    ) : (
                      <button
                        className={styles.addImageButton}
                        onClick={() =>
                          setEditingImage({
                            ...image,
                            editIndex: 0,
                          })
                        }
                      >
                        + Add Image
                      </button>
                    );
                  })()}
                </div>

                {isMultiImageEnabled && (
                  <button
                    className={styles.moreViewsButton}
                    onClick={() => setEditingImage(image)}
                  >
                    {(() => {
                      const extraViews = image.imageUrls.filter(
                        (img) => img.detailOrder !== 0 && img.url
                      ).length;
                      return extraViews > 0
                        ? `${extraViews} more view${extraViews > 1 ? "s" : ""}`
                        : "+ Add more views";
                    })()}
                  </button>
                )}
              </>
            ) : image.imageUrl ? (
              <>
                <Image
                  src={image.imageUrl}
                  alt={image.title || "Uploaded Image"}
                  width={image.width || 300}
                  height={image.height || 200}
                  style={{
                    border: activeSection === "artwork" ? `4px solid ${image.color || "#ccc"}` : undefined,
                    borderRadius: "8px",
                  }}
                />

                {isAdmin && isMultiImageEnabled && (
                  <button
                    className={styles.moreViewsButton}
                    onClick={() =>
                      setEditingImage({
                        ...image,
                        imageUrls: [
                          {
                            url: image.imageUrl,
                            width: image.width,
                            height: image.height,
                            detailOrder: 0,
                            cloudinaryId: image.cloudinaryId || null,
                          },
                        ],
                      })
                    }
                  >
                    + Add more views
                  </button>
                )}
              </>
            ) : (
              <div className={styles.imagePlaceholder}>No image available</div>
            )}

            <p className={styles.title}>{image.title}</p>
            {image.description && (
              <div className={styles.descriptionWrapper}>
                <p className={styles.info}>
                  {expandedDescriptions[image.id]
                    ? image.description
                    : `${image.description.slice(0, 50)}${image.description.length > 50 ? "..." : ""}`}
                </p>
                {image.description.length > 50 && (
                  <button
                    onClick={() => toggleDescription(image.id)}
                    className={styles.readMoreButton}
                  >
                    {expandedDescriptions[image.id] ? "Read less" : "Read more"}
                  </button>
                )}
              </div>
            )}

            {image.dimensions && <p className={styles.info}>{image.dimensions}</p>}
            {image.price && <p className={styles.info}>{image.price}</p>}

            <div className={styles.reorderButtons}>
              {activeSection !== "artwork" && index > 0 && (
                <button onClick={() => reorderImages(index, -1)} className={styles.moveButton}>▲</button>
              )}
              {activeSection !== "artwork" && index < images.length - 1 && (
                <button onClick={() => reorderImages(index, 1)} className={styles.moveButton}>▼</button>
              )}
            </div>

            {isAdmin && (
              <div className={styles.textActions}>
                <button onClick={() => handleEdit(image)} className={styles.button}>Edit</button>
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this?")) {
                      deleteImage(
                        image.id,
                        image.imageUrls?.map(img => img.cloudinaryId) || [image.cloudinaryId]
                      );
                    }
                  }}
                  className={styles.button}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        );
      })}

      {editingImage && (
        <AdminModal
          item={editingImage}
          onClose={() => setEditingImage(null)}
          onSave={handleSave}
          section={activeSection}
          excludedFields={excludedFields}
          config={config}
        />
      )}
    </div>
  );
};

export default AdminImageDisplay;