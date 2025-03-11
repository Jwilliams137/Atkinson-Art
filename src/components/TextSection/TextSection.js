import styles from "./TextSection.module.css";

const TextSection = ({ textUploads, containerClass, sectionClass, textClass }) => {
    if (!textUploads.length) return null;

    return (
        <div className={`${styles.textContainer} ${containerClass || ""}`}>
            <div className={`${styles.textSection} ${sectionClass || ""}`}>
                {textUploads.map((text, index) => {
                    const content = typeof text === "string" ? text : text.content;
                    if (!content) return null; 

                    return content.split("\n\n").map((para, idx) => (
                        <p
                            key={`${index}-${idx}`}
                            className={`${styles.text} ${textClass || ""}`}
                        >
                            {para.trim()}
                        </p>
                    ));
                })}
            </div>
        </div>
    );
};

export default TextSection;

