"use client";

import { documentDetails, qaPairs } from "@/utils/data";
import React, { useState, useMemo } from "react";
import { Search, ChevronDown } from "lucide-react";
import Pagination from "../components/Pagination";

const PAGE_SIZE = 5;

export const CourseDocument: React.FC = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredQA = useMemo(() => {
    return qaPairs.filter(
      (qa) => qa.key.toLowerCase().includes(search.toLowerCase()) || qa.tag.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const paginatedQA = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredQA.slice(start, start + PAGE_SIZE);
  }, [filteredQA, page]);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100 space-y-8">
      {/* Header + Search */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h2 className="text-2xl font-bold text-orange-500 tracking-tight">📄 Course Document</h2>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search Q&A by keyword or tag..."
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-orange-300 focus:ring-2 focus:ring-orange-400 focus:outline-none transition"
          />
        </div>
      </div>

      {/* Q&A Section */}
      <div>
        <h3 className="text-lg font-semibold text-orange-600 mb-3">❓ Questions & Answers</h3>

        {paginatedQA.length === 0 && (
          <div className="text-center text-gray-500 italic py-8">Không tìm thấy câu hỏi nào phù hợp 😔</div>
        )}

        <ul className="space-y-3">
          {paginatedQA.map((qa, idx) => {
            const isOpen = openIndex === idx;
            return (
              <li
                key={idx}
                className="border border-orange-100 rounded-xl bg-gradient-to-br from-orange-50 to-white hover:shadow-md transition"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full flex justify-between items-center px-4 py-3 text-left focus:outline-none"
                >
                  <div>
                    <p className="font-medium text-gray-800">{qa.key}</p>
                    <span className="text-xs text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">#{qa.tag}</span>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-orange-500 transform transition ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-gray-600 text-sm border-t border-orange-100">{qa.answer}</div>
                )}
              </li>
            );
          })}
        </ul>

        {/* Pagination */}
        {filteredQA.length > PAGE_SIZE && (
          <div className="mt-6 flex justify-center">
            <Pagination page={page} total={filteredQA.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
          </div>
        )}
      </div>

      {/* Document Details */}
      <div>
        <h3 className="text-lg font-semibold text-orange-600 mb-3">📑 Document Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700 border border-orange-100 rounded-lg overflow-hidden">
            <thead className="bg-orange-100 text-orange-700">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Content</th>
              </tr>
            </thead>
            <tbody>
              {documentDetails.map((doc, idx) => (
                <tr key={idx} className="odd:bg-white even:bg-orange-50 hover:bg-orange-100 transition">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2 font-medium">{doc.title}</td>
                  <td className="px-4 py-2 text-gray-600">{doc.content}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default CourseDocument;
