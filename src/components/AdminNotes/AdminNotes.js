"use client";
import styles from "./AdminNotes.module.css"

const AdminNotes = ({ section, fieldsForPage }) => {
  if (!section || !Array.isArray(fieldsForPage?.[section])) return null;

  const notes = fieldsForPage[section]
    .filter((field) => field.notes)
    .map((field, index) => (
      <li key={index}>{field.notes}</li>
    ));

  return notes.length > 0 ? (
    <div> 
      <ul className={styles.notes}>{notes}</ul>
    </div>
  ) : null;
};

export default AdminNotes;