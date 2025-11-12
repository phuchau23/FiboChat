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
  const renderTopicList = (topics: Topic[], loading: boolean) => {
    if (loading) {
      return <div className="text-center py-6 text-orange-600">Đang tải dữ liệu...</div>;
    }

    if (!topics.length) {
      return <div className="text-center py-6 text-gray-500">Không có chủ đề nào.</div>;
    }

    return (
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
    );
  };

  // Chọn topics hiển thị theo tab + semester
  const topicsToShow = selectedSemesterId ? topicsBySemester : activeTab === "all" ? allTopics : myTopics;
  const loadingToShow = selectedSemesterId ? loadingTopicsBySemester : activeTab === "all" ? allLoading : myLoading;

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <Card className="border border-orange-200/70 shadow-md rounded-2xl bg-gradient-to-b from-white via-orange-50/40 to-white">
        <CardHeader className="pb-2 border-b border-orange-100">
          <CardTitle className="text-lg font-semibold text-orange-700">Topic Overview</CardTitle>
        </CardHeader>

        <CardContent className="pt-4">
          {/* Dropdown chọn kỳ học */}
          <div className="mb-4">
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

            <TabsContent value="all">{renderTopicList(topicsToShow, loadingToShow)}</TabsContent>
            <TabsContent value="my">{renderTopicList(topicsToShow, loadingToShow)}</TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
