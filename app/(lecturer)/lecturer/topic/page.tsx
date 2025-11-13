"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useAllTopics, useTopicsByLecturer } from "@/hooks/useTopic";
import { useSemesters } from "@/hooks/useSemester";
import { useQuery } from "@tanstack/react-query";
import apiService from "@/lib/api/core";
import { Topic } from "@/lib/api/services/fetchTopic";

/** Hook fetch topic theo semester */
function useTopicsBySemester(semesterId?: string) {
  return useQuery({
    queryKey: ["topicsBySemester", semesterId],
    queryFn: async () => {
      if (!semesterId) return []; // trả về rỗng nếu không chọn kỳ
      const res = await apiService.get<{ data: Topic[] }>(`/auth/api/topics?semesterId=${semesterId}`);
      return res.data.data;
    },
    enabled: !!semesterId,
  });
}

/** 🎓 Component LecturerTopicView */
export default function LecturerTopicView() {
  // Tabs
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");

  // Dropdown semester
  const { semesters = [], isLoading: loadingSemesters } = useSemesters(1, 100);
  const [selectedSemesterId, setSelectedSemesterId] = useState<string | null>(null);

  // Search
  const [searchTerm, setSearchTerm] = useState("");

  // Topics
  const { topics: allTopics = [], isLoading: allLoading } = useAllTopics();
  const { topics: myTopics = [], isLoading: myLoading } = useTopicsByLecturer();

  // Topics theo semester nếu có chọn
  const { data: topicsBySemester = [], isLoading: loadingTopicsBySemester } = useTopicsBySemester(
    selectedSemesterId || undefined
  );

  /** 🟠 Hiển thị trạng thái dưới dạng badge */
  const renderStatus = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return (
          <Badge className="bg-orange-100 text-orange-700 border border-orange-300 rounded-md px-2 py-0.5 text-xs">
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-gray-100 text-gray-600 border border-gray-300 rounded-md px-2 py-0.5 text-xs">
            Inactive
          </Badge>
        );
      default:
        return null;
    }
  };

  /** 🟢 Render danh sách Topic */
  const renderTopicList = (
    topics: Topic[],
    loading: boolean,
    currentPage: number,
    totalPages: number,
    onPageChange: (page: number) => void
  ) => {
    if (loading) {
      return <div className="text-center py-6 text-orange-600">Đang tải dữ liệu...</div>;
    }

    if (!topics.length) {
      return <div className="text-center py-6 text-gray-500">Không có chủ đề nào.</div>;
    }

    return (
      <>
        <motion.div
          layout
          className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
          transition={{ duration: 0.2 }}
        >
          {topics.map((topic) => (
            <motion.div
              key={topic.id}
              layout
              className="border border-orange-100 bg-white/90 rounded-xl p-4 shadow-sm hover:shadow-md hover:bg-orange-50/50 transition-all"
            >
              <div className="font-semibold text-orange-800">{topic.name}</div>
              <div className="text-sm text-gray-600 mt-1 line-clamp-2">{topic.description}</div>
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-gray-500">{topic.masterTopic?.name ?? "Không có Master Topic"}</span>
                {renderStatus(topic.status)}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-4 gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-orange-50"
          >
            Prev
          </button>

          <span className="text-sm text-gray-600">
            Page {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-orange-50"
          >
            Next
          </button>
        </div>
      </>
    );
  };

  const [allPage, setAllPage] = useState(1);
  const [myPage, setMyPage] = useState(1);
  const itemsPerPage = 8;

  // Chọn topics theo tab + semester
  const topicsToShow = selectedSemesterId ? topicsBySemester : activeTab === "all" ? allTopics : myTopics;

  const loadingToShow = selectedSemesterId ? loadingTopicsBySemester : activeTab === "all" ? allLoading : myLoading;

  // 🔍 Filter theo search term
  const filteredTopics = topicsToShow.filter(
    (t) =>
      t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination riêng từng tab
  const currentPage = activeTab === "all" ? allPage : myPage;
  const totalPages = Math.ceil(filteredTopics.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTopics = filteredTopics.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <Card className="border border-orange-200/70 shadow-md rounded-2xl bg-gradient-to-b from-white via-orange-50/40 to-white">
        <CardHeader className="pb-2 border-b border-orange-100">
          <CardTitle className="text-lg font-semibold text-orange-700">Topic Overview</CardTitle>
        </CardHeader>

        <CardContent className="pt-4">
          {/* Bộ lọc semester + search */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
            {loadingSemesters ? (
              <span className="text-sm text-gray-500">Đang tải kỳ học...</span>
            ) : (
              <select
                value={selectedSemesterId || ""}
                onChange={(e) => setSelectedSemesterId(e.target.value || null)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="">All semesters</option>
                {semesters.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code} - {s.term}/{s.year}
                  </option>
                ))}
              </select>
            )}

            {/* 🔍 Search input */}
            <input
              type="text"
              placeholder="Tìm kiếm chủ đề..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-orange-200 rounded px-3 py-1 text-sm w-full sm:w-64 focus:ring-1 focus:ring-orange-300 outline-none"
            />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "all" | "my")}>
            <TabsList className="bg-orange-50 border border-orange-100 rounded-xl p-1 w-fit mb-4">
              <TabsTrigger
                value="all"
                className={`px-4 py-1.5 rounded-lg text-sm font-medium ${
                  activeTab === "all"
                    ? "bg-white text-orange-700 border border-orange-200 shadow-sm"
                    : "text-gray-600 hover:text-orange-600"
                }`}
              >
                All Topics
              </TabsTrigger>
              <TabsTrigger
                value="my"
                className={`px-4 py-1.5 rounded-lg text-sm font-medium ${
                  activeTab === "my"
                    ? "bg-white text-orange-700 border border-orange-200 shadow-sm"
                    : "text-gray-600 hover:text-orange-600"
                }`}
              >
                My Topics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              {renderTopicList(paginatedTopics, loadingToShow, allPage, totalPages, (p) =>
                setAllPage(Math.min(Math.max(p, 1), totalPages))
              )}
            </TabsContent>

            <TabsContent value="my">
              {renderTopicList(paginatedTopics, loadingToShow, myPage, totalPages, (p) =>
                setMyPage(Math.min(Math.max(p, 1), totalPages))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
