import React from 'react';
import styles from "./ExhibitionTextSection.module.css";

const ExhibitionTextSection = ({ textUploads, containerClass, sectionClass, textClass }) => {
    if (!textUploads.length) return null;

    const groupedByYear = textUploads.reduce((acc, item) => {
        if (item.year) {
            acc[item.year] = acc[item.year] || [];
            acc[item.year].push(item.content);
        }
        return acc;
    }, {});

    return (
        <div className={`${styles.textContainer} ${containerClass || ""}`}>
            <div className={`${styles.textSection} ${sectionClass || ""}`}>
                {Object.entries(groupedByYear)
                    .sort(([a], [b]) => Number(b) - Number(a))
                    .map(([year, exhibitions]) => (
                        <div key={year} className={styles.yearGroup}>
                            <h3 className={styles.year}>{year}</h3>
                            {exhibitions.map((text, index) => {
                                return text.split("\n\n").map((para, idx) => (
                                    <p key={`${index}-${idx}`} className={`${styles.text} ${textClass || ""}`}>
                                        {para.trim()}
                                    </p>
                                ));
                            })}
                        </div>
                    ))}
            </div>
        </div>
    );
    
};

export default ExhibitionTextSection;