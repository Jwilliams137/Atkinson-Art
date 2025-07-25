'use client';
import { useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import styles from "./AdminTextDisplay.module.css";

const AdminTextDisplay = ({ texts = [], setTexts, db }) => {
  const [expandedTextIds, setExpandedTextIds] = useState([]);
  const [editingTextId, setEditingTextId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editYear, setEditYear] = useState("");
  const [editLink, setEditLink] = useState("");
  const [editButtonText, setEditButtonText] = useState("");
  const [showYearField, setShowYearField] = useState(false);
  const [showLinkField, setShowLinkField] = useState(false);
  const [showContentField, setShowContentField] = useState(false);

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

    const isLinkOnly = !!text.link || !!text.buttonText;
    const isStatement = !!text.content && !isLinkOnly;

    setShowYearField("year" in text);
    setShowLinkField(isLinkOnly);
    setShowContentField(isStatement);
  };

  const saveEdit = async (id) => {
    try {
      const textRef = doc(db, "textUploads", id);
      const updatedFields = { content: editContent };

      if (showYearField) updatedFields.year = editYear;
      if (showLinkField) {
        updatedFields.link = editLink;
        updatedFields.buttonText = editButtonText;
      }

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
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= texts.length) return;

    const newTexts = [...texts];
    [newTexts[index], newTexts[newIndex]] = [newTexts[newIndex], newTexts[index]];
    setTexts(newTexts);
    await updateTextOrder(newTexts);
  };

  const updateTextOrder = async (newTexts) => {
    try {
      for (let i = 0; i < newTexts.length; i++) {
        const textRef = doc(db, "textUploads", newTexts[i].id);
        await updateDoc(textRef, { order: i });
      }
    } catch (error) {
      console.error("Error updating text order:", error);
    }
  };

  return (
    <div className={styles.textList}>
      {[...texts]
        .sort((a, b) => {
          const yearA = parseInt(a.year) || 0;
          const yearB = parseInt(b.year) || 0;
          if (yearA !== yearB) return yearB - yearA;
          return (a.order ?? 0) - (b.order ?? 0);
        })
        .map((text, index) => {
          const isExpanded = expandedTextIds.includes(text.id);
          const formattedContent = (text.content || "")
            .split("\n\n")
            .map((para) => para.trim())
            .join("\n\n");
          const displayedContent = isExpanded
            ? formattedContent
            : formattedContent.slice(0, 80);

          return (
            <div key={text.id || index} className={styles.textItem}>
              <div className={styles.moveArrows}>
                {index > 0 && (
                  <button
                    onClick={() => moveText(index, -1)}
                    className={styles.moveButton}
                    title="Move Up"
                  >
                    ▲
                  </button>
                )}
                {index < texts.length - 1 && (
                  <button
                    onClick={() => moveText(index, 1)}
                    className={styles.moveButton}
                    title="Move Down"
                  >
                    ▼
                  </button>
                )}
              </div>

              <div className={styles.textContent}>
                {editingTextId === text.id ? (
                  <>
                    {showContentField && (
                      <textarea
                        className={styles.editTextarea}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                      />
                    )}
                    {showLinkField && (
                      <>
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
                    )}
                    {showYearField && (
                      <input
                        type="text"
                        className={styles.editInput}
                        value={editYear}
                        placeholder="Year"
                        onChange={(e) => setEditYear(e.target.value)}
                      />
                    )}
                  </>
                ) : (
                  <>
                    {text.year && <p className={styles.year}>{text.year}</p>}
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
          );
        })}
    </div>
  );
};

export default AdminTextDisplay;