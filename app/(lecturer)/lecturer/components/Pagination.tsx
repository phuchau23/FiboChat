"use client";
import React from "react";

export const Pagination: React.FC<{
  page: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}> = ({ page, total, pageSize, onPageChange }) => {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 16 }}>
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        style={{
          marginRight: 8,
          padding: "4px 12px",
          background: "#fa7a1c",
          color: "#fff",
          border: "none",
          borderRadius: 6,
        }}
      >
        Prev
      </button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          style={{
            margin: "0 4px",
            background: page === i + 1 ? "#fa7a1c" : "#fff",
            color: page === i + 1 ? "#fff" : "#fa7a1c",
            border: "1px solid #fa7a1c",
            borderRadius: 6,
            padding: "4px 12px",
            cursor: "pointer",
          }}
          onClick={() => onPageChange(i + 1)}
        >
          {i + 1}
        </button>
      ))}
      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        style={{
          marginLeft: 8,
          padding: "4px 12px",
          background: "#fa7a1c",
          color: "#fff",
          border: "none",
          borderRadius: 6,
        }}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
