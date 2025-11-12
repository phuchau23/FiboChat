"use client";

import React, { useState, useMemo, useEffect } from "react";
import { getCookie } from "cookies-next";
import { X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Pagination from "../components/Pagination";
import { useFeedbackByLecturer } from "@/hooks/useFeedback";
import { useTopicsByLecturer } from "@/hooks/useTopic";
import { FeedbackByLecturerItem } from "@/lib/api/services/fetchFeedBack";

const PAGE_SIZE = 5;

export default function FeedbackTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<FeedbackByLecturerItem | null>(null);
  const [lecturerId, setLecturerId] = useState<string>("");
  const [filterTopicId, setFilterTopicId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const id = getCookie("user-id") as string | undefined;
    if (id) setLecturerId(id);
  }, []);

  const { data, isLoading, isError, refetch } = useFeedbackByLecturer(lecturerId, page, PAGE_SIZE);
  const { topics, isLoading: topicLoading } = useTopicsByLecturer(lecturerId ?? undefined, 1, 50);

  useEffect(() => {
    if (lecturerId) refetch();
  }, [lecturerId, refetch]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const feedbacks = data?.data?.items ?? [];

  // Filter theo topic + search
  const filtered = useMemo(() => {
    return feedbacks.filter((f) => {
      const matchTopic = filterTopicId ? f.topic?.id === filterTopicId : true;
      const s = search.toLowerCase();
      const matchSearch =
        f.user.firstName.toLowerCase().includes(s) ||
        f.user.lastName.toLowerCase().includes(s) ||
        f.answer.content.toLowerCase().includes(s) ||
        (f.comment?.toLowerCase().includes(s) ?? false) ||
        (f.topic?.name?.toLowerCase().includes(s) ?? false);
      return matchTopic && matchSearch;
    });
  }, [feedbacks, filterTopicId, search]);

  if (!lecturerId) {
    return (
      <div className="flex justify-center py-10 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Loading lecturer info...
      </div>
    );
  }

  return (
    <section className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
      <h2 className="text-2xl font-bold mb-6 text-orange-500 flex items-center gap-2">Student Feedback</h2>

      <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-4">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="🔍 Search by student, topic, or content..."
          className="flex-1 px-4 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition mb-2 md:mb-0"
        />
        <select
          value={filterTopicId ?? ""}
          onChange={(e) => setFilterTopicId(e.target.value || null)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="">All Topics</option>
          {topics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {isLoading || topicLoading ? (
        <div className="flex justify-center py-10 text-gray-500">
          <Loader2 className="animate-spin mr-2" /> Loading feedback...
        </div>
      ) : isError ? (
        <div className="text-center py-6 text-red-500">Failed to load feedback.</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-6 text-gray-500">No feedback found.</div>
      ) : (
        <>
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full border-collapse">
              <thead className="bg-orange-50">
                <tr className="text-left text-sm text-gray-600">
                  <th className="p-3 font-medium">Student</th>
                  <th className="p-3 font-medium">Topic</th>
                  <th className="p-3 font-medium">Answer</th>
                  <th className="p-3 font-medium">Helpful</th>
                  <th className="p-3 font-medium text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((fb) => (
                  <tr
                    key={fb.id}
                    className="cursor-pointer hover:bg-orange-100 transition"
                    onClick={() => setSelected(fb)}
                  >
                    <td className="p-3 font-semibold">{`${fb.user.firstName} ${fb.user.lastName}`}</td>
                    <td className="p-3 text-gray-700">{fb.topic?.name ?? "—"}</td>
                    <td className="p-3 text-gray-700 max-w-[250px]">
                      <div
                        className={`overflow-hidden transition-all relative ${
                          expandedId === fb.id ? "max-h-[1000px]" : "max-h-24"
                        }`}
                      >
                        <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: fb.answer.content }} />
                        {fb.answer.content.length > 50 && expandedId !== fb.id && (
                          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white via-white/70 to-transparent" />
                        )}
                      </div>
                      {fb.answer.content.length > 50 && (
                        <button
                          className="text-sm text-orange-500 mt-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedId(expandedId === fb.id ? null : fb.id);
                          }}
                        >
                          {expandedId === fb.id ? "Show less" : "Show more"}
                        </button>
                      )}
                    </td>

                    <td className="p-3 capitalize text-gray-700">{fb.helpful}</td>
                    <td className="p-3 text-center">
                      <span className="text-orange-500 font-semibold hover:underline">View</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination page={page} total={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
        </>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-auto"
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
                From: <strong>{`${selected.user.firstName} ${selected.user.lastName}`}</strong>
              </p>

              {selected.topic && (
                <div className="mb-4">
                  <p className="font-medium mb-1">Topic:</p>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border">{selected.topic.name}</p>
                </div>
              )}

              <div className="mb-4">
                <p className="font-medium mb-1">Answer:</p>
                <div
                  className="text-gray-700 bg-gray-50 p-3 rounded-lg border max-h-80 overflow-auto"
                  dangerouslySetInnerHTML={{ __html: selected.answer.content }}
                />
              </div>

              <div className="mb-4">
                <p className="font-medium mb-1">Helpful:</p>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border capitalize">{selected.helpful}</p>
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
}
