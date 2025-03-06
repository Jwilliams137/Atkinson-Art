import React from 'react';
import styles from "./TextSection.module.css";

const TextSection = ({
    textUploads,
    containerClass,
    sectionClass,
    textClass,
    yearClass,
}) => {
    if (!textUploads.length) return null;

    return (
        <div className={`${styles.textContainer} ${containerClass || ""}`}>
            <div className={`${styles.textSection} ${sectionClass || ""}`}>
                {textUploads.map((text, index) => {
                    const content = typeof text === "string" ? text : text.content;
                    if (!content) return null; 

                    const paragraphs = content.split("\n\n");

                    return (
                        <div key={index} className={styles.textItem}>
                            {text.year !== undefined && text.year !== "" && (
                                <p className={`${styles.year} ${yearClass || ""}`}>{text.year}</p>
                            )}
                            {paragraphs.map((para, idx) => (
                                <p
                                    key={`${index}-${idx}`}
                                    className={`${styles.text} ${textClass || ""}`}
                                >
                                    {para.trim()}
                                </p>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TextSection;
