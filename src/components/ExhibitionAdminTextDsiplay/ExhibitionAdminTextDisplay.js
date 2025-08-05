'use client';
import { useState } from "react";
import { doc, deleteDoc, updateDoc, getDocs, query, collection, where } from "firebase/firestore";
import styles from "./ExhibitionAdminTextDisplay.module.css";

const ExhibitionAdminTextDisplay = ({ texts = [], setTexts, db }) => {
    const [expandedTextIds, setExpandedTextIds] = useState([]);
    const [editingTextId, setEditingTextId] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [editYear, setEditYear] = useState("");
    const [editLink, setEditLink] = useState("");
    const [editButtonText, setEditButtonText] = useState("");

    const toggleText = (id) => {
        setExpandedTextIds((prev) =>
            prev.includes(id) ? prev.filter((textId) => textId !== id) : [...prev, id]
        );
    };

    const startEditing = (text) => {
        setEditingTextId(text.id);
        setEditContent(text.content || "");
        setEditYear(text.year || "");
        setEditLink(text.link || "");
        setEditButtonText(text.buttonText || "");
    };

    const saveEdit = async (id) => {
        try {
            const textRef = doc(db, "textUploads", id);
            const updatedFields = {
                content: editContent,
                year: editYear,
                link: editLink,
                buttonText: editButtonText,
            };

            await updateDoc(textRef, updatedFields);

            setTexts((prevTexts) =>
                prevTexts.map((text) =>
                    text.id === id ? { ...text, ...updatedFields } : text
                )
            );

            setEditingTextId(null);
        } catch (error) {
            console.error("Error updating text:", error);
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

    const moveText = async (index, direction) => {
        const freshSnapshot = await getDocs(query(collection(db, "textUploads"), where("pageType", "==", "exhibitions")));
        const freshTexts = freshSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const sorted = [...freshTexts].sort((a, b) => {
            const yearDiff = (parseInt(b.year) || 0) - (parseInt(a.year) || 0);
            if (yearDiff !== 0) return yearDiff;
            return (a.snippetOrder ?? 0) - (b.snippetOrder ?? 0);
        });

        const movingItem = sorted[index];
        const year = movingItem.year || "unknown";

        const sameYearGroup = sorted.filter(item => (item.year || "unknown") === year);
        const currentIndex = sameYearGroup.findIndex(t => t.id === movingItem.id);
        const newIndex = currentIndex + direction;

        if (newIndex < 0 || newIndex >= sameYearGroup.length) return;

        [sameYearGroup[currentIndex], sameYearGroup[newIndex]] = [
            sameYearGroup[newIndex],
            sameYearGroup[currentIndex],
        ];

        const updatedGroup = sameYearGroup.map((item, i) => ({
            ...item,
            snippetOrder: i + 1,
        }));

        await Promise.all(updatedGroup.map(async (item) => {
            const textRef = doc(db, "textUploads", item.id);
            console.log(`Updating ${item.id} with snippetOrder ${item.snippetOrder}`);
            await updateDoc(textRef, { snippetOrder: item.snippetOrder });
        }));
    };

    const sortedTexts = [...texts].sort((a, b) => {
        const yearA = parseInt(a.year) || 0;
        const yearB = parseInt(b.year) || 0;
        if (yearA !== yearB) return yearB - yearA;
        return (a.snippetOrder ?? 0) - (b.snippetOrder ?? 0);
    });

    let lastYear = null;

    return (
        <div className={styles.textList}>
            {sortedTexts.map((text, index) => {
                const isExpanded = expandedTextIds.includes(text.id);
                const formattedContent = (text.content || "")
                    .split("\n\n")
                    .map((para) => para.trim())
                    .join("\n\n");
                const displayedContent = isExpanded
                    ? formattedContent
                    : formattedContent.slice(0, 80);

                const showYearHeader = text.year !== lastYear;
                lastYear = text.year;

                return (
                    <div key={text.id || index}>
                        {showYearHeader && (
                            <h2 className={styles.yearHeader}>{text.year || "Unknown Year"}</h2>
                        )}

                        <div className={styles.textItem}>
                            <div className={styles.moveArrows}>
                                {(() => {
                                    const currentYear = text.year || "unknown";
                                    const yearGroup = sortedTexts.filter(t => (t.year || "unknown") === currentYear);
                                    const yearIndexes = yearGroup.map(t => sortedTexts.indexOf(t));
                                    const currentIndexInYear = yearIndexes.indexOf(index);

                                    return (
                                        <>
                                            {yearGroup.length > 1 && currentIndexInYear > 0 && (
                                                <button
                                                    onClick={() => moveText(index, -1)}
                                                    className={styles.moveButton}
                                                    title="Move Up"
                                                >
                                                    ▲
                                                </button>
                                            )}
                                            {yearGroup.length > 1 && currentIndexInYear < yearGroup.length - 1 && (
                                                <button
                                                    onClick={() => moveText(index, 1)}
                                                    className={styles.moveButton}
                                                    title="Move Down"
                                                >
                                                    ▼
                                                </button>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>

                            <div className={styles.textContent}>
                                {editingTextId === text.id ? (
                                    <>
                                        <textarea
                                            className={styles.editTextarea}
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            className={styles.editInput}
                                            value={editYear}
                                            placeholder="Year"
                                            onChange={(e) => setEditYear(e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            className={styles.editInput}
                                            value={editLink}
                                            placeholder="Link"
                                            onChange={(e) => setEditLink(e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            className={styles.editInput}
                                            value={editButtonText}
                                            placeholder="Button Text"
                                            onChange={(e) => setEditButtonText(e.target.value)}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <div className={styles.textSnippet}>
                                            {displayedContent.split("\n\n").map((para, idx) => (
                                                <p key={idx} className={styles.paragraph}>
                                                    {para}
                                                </p>
                                            ))}
                                        </div>
                                        {(text.link || text.buttonText) && (
                                            <div className={styles.linkPreview}>
                                                {text.buttonText && (
                                                    <div className={styles.fakeButton}>{text.buttonText}</div>
                                                )}
                                                <div className={styles.linkText}>{text.link}</div>
                                            </div>
                                        )}
                                    </>
                                )}

                                {formattedContent.length > 80 && editingTextId !== text.id && (
                                    <button
                                        onClick={() => toggleText(text.id)}
                                        className={styles.readMoreButton}
                                    >
                                        {isExpanded ? "Read Less" : "Read More"}
                                    </button>
                                )}
                            </div>

                            <div className={styles.textActions}>
                                {editingTextId === text.id ? (
                                    <>
                                        <button
                                            onClick={() => saveEdit(text.id)}
                                            className={styles.editButton}
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setEditingTextId(null)}
                                            className={styles.editButton}
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => startEditing(text)}
                                        className={styles.editButton}
                                    >
                                        Edit
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        const confirmed = window.confirm("Are you sure you want to delete this text?");
                                        if (confirmed) deleteText(text.id);
                                    }}
                                    className={styles.deleteButton}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ExhibitionAdminTextDisplay;