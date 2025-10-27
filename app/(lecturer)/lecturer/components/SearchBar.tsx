"use client";
import React from "react";

export const SearchBar: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => (
  <div
    style={{
      padding: "24px 36px 0 36px",
      borderBottom: "1px solid #eee",
      background: "#fff",
      display: "flex",
      alignItems: "center",
      gap: 16,
      position: "sticky",
      top: 0,
      zIndex: 10,
    }}
  >
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search teachers, courses, students..."
      style={{
        width: "100%",
        padding: "10px 18px",
        borderRadius: 24,
        border: "1px solid #fa7a1c",
        fontSize: 18,
        outline: "none",
        background: "#fff",
        color: "#222",
      }}
    />
  </div>
);
export default SearchBar;
