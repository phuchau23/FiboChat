"use client";

import { reportedQAs, reports } from "@/utils/data";
import React, { useState, useMemo } from "react";
import { Search, AlertTriangle } from "lucide-react";
import Pagination from "../components/Pagination";

const PAGE_SIZE = 5;

export const ReportTable: React.FC = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return reports.filter(
      (r) =>
        r.studentName.toLowerCase().includes(search.toLowerCase()) ||
        r.topic.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "resolved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <section className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100 space-y-8">
      {/* Header + Search */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h2 className="text-2xl font-bold text-orange-500 tracking-tight flex items-center gap-2">
          📝 Student Reports
        </h2>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by student or topic..."
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-orange-300 focus:ring-2 focus:ring-orange-400 focus:outline-none transition"
          />
        </div>
      </div>

      {/* Report List */}
      <div>
        {paginated.length === 0 ? (
          <div className="text-center text-gray-500 italic py-8">Không có báo cáo nào phù hợp 😔</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700 border border-orange-100 rounded-lg overflow-hidden">
              <thead className="bg-orange-100 text-orange-700">
                <tr>
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Student</th>
                  <th className="px-4 py-2">Topic</th>
                  <th className="px-4 py-2">Answer</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Note</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((report, idx) => (
                  <tr key={idx} className="odd:bg-white even:bg-orange-50 hover:bg-orange-100 transition">
                    <td className="px-4 py-2">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                    <td className="px-4 py-2 font-medium">{report.studentName}</td>
                    <td className="px-4 py-2">{report.topic}</td>
                    <td className="px-4 py-2 text-gray-600 max-w-[250px] truncate">{report.answer}</td>
                    <td className="px-4 py-2">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-500 italic">{report.note || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filtered.length > PAGE_SIZE && (
        <div className="mt-4 flex justify-center">
          <Pagination page={page} total={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
        </div>
      )}

      {/* Reported QA ≥ 3 times */}
      <div>
        <h3 className="text-lg font-semibold text-red-500 mb-3 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Q&A Reported ≥ 3 Times
        </h3>

        {reportedQAs.length === 0 ? (
          <div className="text-center text-gray-500 italic py-4">Chưa có Q&A nào bị báo cáo nhiều lần 👌</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700 border border-red-100 rounded-lg overflow-hidden">
              <thead className="bg-red-100 text-red-700">
                <tr>
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Question Key</th>
                  <th className="px-4 py-2">Reported Times</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {reportedQAs.map((qa, idx) => (
                  <tr key={idx} className="odd:bg-white even:bg-red-50 hover:bg-red-100 transition">
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2 font-medium">{qa.key}</td>
                    <td className="px-4 py-2 text-red-600 font-semibold">{qa.timesReported}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          qa.status === "flagged" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                        }`}
                      >
                        {qa.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReportTable;
