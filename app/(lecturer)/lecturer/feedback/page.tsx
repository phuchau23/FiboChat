"use client";

import { Feedback, feedbacks } from "@/utils/data";
import React, { useState, useMemo } from "react";
import Pagination from "../components/Pagination";
import { Star, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PAGE_SIZE = 5;

export const FeedbackTable: React.FC = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Feedback | null>(null);

  const filtered = useMemo(() => {
    return feedbacks.filter(
      (f) =>
        f.studentName.toLowerCase().includes(search.toLowerCase()) ||
        f.answer.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  return (
    <section className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
      <h2 className="text-2xl font-bold mb-6 text-orange-500 flex items-center gap-2">📝 Student Feedback</h2>

      {/* Search bar */}
      <div className="flex gap-4 mb-4">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="🔍 Search feedback by student or content..."
          className="flex-1 px-4 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full border-collapse">
          <thead className="bg-orange-50">
            <tr className="text-left text-sm text-gray-600">
              <th className="p-3 font-medium">Student</th>
              <th className="p-3 font-medium">Answer</th>
              <th className="p-3 font-medium">Rating</th>
              <th className="p-3 font-medium text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((fb, idx) => (
              <tr key={idx} className="cursor-pointer hover:bg-orange-100 transition" onClick={() => setSelected(fb)}>
                <td className="p-3 font-semibold">{fb.studentName}</td>
                <td className="p-3 text-gray-700 truncate max-w-[250px]">{fb.answer}</td>
                <td className="p-3">
                  <div className="flex gap-1">
                    {Array.from({ length: fb.rating }).map((_, i) => (
                      <Star key={i} size={16} className="fill-orange-400 text-orange-400" />
                    ))}
                  </div>
                </td>
                <td className="p-3 text-center">
                  <span className="text-orange-500 font-semibold hover:underline">View</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <Pagination page={page} total={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                onClick={() => setSelected(null)}
              >
                <X size={20} />
              </button>
              <h3 className="text-xl font-bold text-orange-500 mb-2">Feedback Detail</h3>
              <p className="text-sm text-gray-500 mb-4">
                From: <strong>{selected.studentName}</strong>
              </p>

              <div className="mb-4">
                <p className="font-medium mb-1">Answer:</p>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border">{selected.answer}</p>
              </div>

              <div className="mb-4">
                <p className="font-medium mb-1">Rating:</p>
                <div className="flex gap-1">
                  {Array.from({ length: selected.rating }).map((_, i) => (
                    <Star key={i} size={20} className="fill-orange-400 text-orange-400" />
                  ))}
                </div>
              </div>

              {selected.comment && (
                <div>
                  <p className="font-medium mb-1">Comment:</p>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border">{selected.comment}</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default FeedbackTable;
