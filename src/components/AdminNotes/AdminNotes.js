"use client";
import React from "react";

const AdminNotes = ({ section, fieldsForPage }) => {
  if (!section || !Array.isArray(fieldsForPage?.[section])) return null;

  console.log("Fields in section:", fieldsForPage[section]); // Debugging

  const notes = fieldsForPage[section]
    .filter((field) => field.notes) // Ensure only fields with notes are included
    .map((field, index) => (
      <li key={index} className="admin-note">{field.notes}</li>
    ));

  return notes.length > 0 ? (
    <div className="admin-notes"> 
      <ul>{notes}</ul>
    </div>
  ) : null;
};

export default AdminNotes;
