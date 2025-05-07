"use client";
import styles from "./ImageDetails.module.css";

const ImageDetails = ({
  title,
  description,
  dimensions,
  price,
  isExpanded,
  toggleDescription,
}) => {
  const truncate = (text, wordLimit) => {
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  return (
    <div className={styles.label}>
      <p className={styles.title}>{title}</p>
      {description && (
        <p>
        <span className={styles.descriptionText}>
          {isExpanded ? description : truncate(description, 6)}
        </span>
        {description.split(" ").length > 6 && (
          <button onClick={toggleDescription} className={styles.readMoreToggle}>
            {isExpanded ? "Read less" : "Read more"}
          </button>
        )}
      </p>      
      )}
      {dimensions && <p>{dimensions}</p>}
      {price !== "" && <p>{price}</p>}
    </div>
  );
};

export default ImageDetails;
