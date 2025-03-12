import { useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import styles from "./AdminTextDisplay.module.css";

const AdminTextDisplay = ({ texts = [], setTexts, db }) => {
  const [expandedTextIds, setExpandedTextIds] = useState([]);
  const [editingTextId, setEditingTextId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const toggleText = (id) => {
    setExpandedTextIds((prevIds) =>
      prevIds.includes(id) ? prevIds.filter((textId) => textId !== id) : [...prevIds, id]
    );
  };

  const startEditing = (text) => {
    setEditingTextId(text.id);
    setEditContent(text.content);
  };

  const saveEdit = async (id) => {
    try {
      const textRef = doc(db, "textUploads", id);
      await updateDoc(textRef, { content: editContent });

      setTexts((prevTexts) =>
        prevTexts.map((text) =>
          text.id === id ? { ...text, content: editContent } : text
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
      {texts.map((text, index) => {
        const isExpanded = expandedTextIds.includes(text.id);
        const formattedContent = text.content
          .split("\n\n")
          .map((para) => para.trim())
          .join("\n\n");
        const displayedContent = isExpanded
          ? formattedContent
          : formattedContent.slice(0, 80);

        return (
          <div key={text.id || index} className={styles.textItem}>
            <div className={styles.textContent}>
              {text.year && text.year !== "" && (
                <p className={styles.year}>{text.year}</p>
              )}
              {editingTextId === text.id ? (
                <textarea
                  className={styles.editInput}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
              ) : (
                <div className={styles.textSnippet}>
                  {displayedContent.split("\n\n").map((para, idx) => (
                    <p key={idx} className={styles.paragraph}>{para}</p>
                  ))}
                </div>
              )}
              {formattedContent.length > 80 && (
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
                <button onClick={() => saveEdit(text.id)} className={styles.editButton}>
                  Save
                </button>
              ) : (
                <button onClick={() => startEditing(text)} className={styles.editButton}>
                  Edit
                </button>
              )}
              <button
                onClick={() => deleteText(text.id)}
                className={styles.deleteButton}
              >
                Delete
              </button>
              <div className={styles.reorderButtons}>
                {index > 0 && (
                  <button
                    onClick={() => moveText(index, -1)}
                    className={styles.moveButton}
                  >
                    Move Up
                  </button>
                )}
                {index < texts.length - 1 && (
                  <button
                    onClick={() => moveText(index, 1)}
                    className={styles.moveButton}
                  >
                    Move Down
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminTextDisplay;
