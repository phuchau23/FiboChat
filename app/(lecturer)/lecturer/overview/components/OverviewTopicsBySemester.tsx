"use client";
import React, { useEffect, useState, useMemo } from "react";
import { fetchSemester, Semester } from "@/lib/api/services/fetchSemester";
import { fetchTopic, Topic } from "@/lib/api/services/fetchTopic";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

export function OverviewTopicsBySemester({ lecturerId }: { lecturerId: string }) {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [selectedSemesterId, setSelectedSemesterId] = useState<string | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);

  // Load semesters
  useEffect(() => {
    const loadSemesters = async () => {
      const res = await fetchSemester.getAllSemesters(1, 50);
      setSemesters(res.data.items);
      if (res.data.items.length > 0) {
        setSelectedSemesterId(res.data.items[0].id);
      }
    };
    loadSemesters();
  }, []);

  // Load topics khi semester thay đổi
  useEffect(() => {
    if (!selectedSemesterId) return;

    const loadTopics = async () => {
      setLoading(true);
      try {
        const res = await fetchTopic.getTopicsByLecturer(lecturerId, 1, 100);
        // Nếu API chưa hỗ trợ filter theo semester, filter local:
        const filteredTopics = res.data.items.filter((t) => {
          const semester = semesters.find((s) => s.id === selectedSemesterId);
          if (!semester) return false;
          return t.createdAt >= semester.startDate && t.createdAt <= semester.endDate;
        });
        setTopics(filteredTopics);
      } finally {
        setLoading(false);
      }
    };
    loadTopics();
  }, [selectedSemesterId, lecturerId, semesters]);

  /** Dữ liệu biểu đồ: stacked bar theo trạng thái */
  const chartData = useMemo(() => {
    return semesters.map((s) => {
      const semesterTopics = topics.filter((t) => t.createdAt >= s.startDate && t.createdAt <= s.endDate);

      const active = semesterTopics.filter((t) => t.status?.toLowerCase() === "active").length;
      const inactive = semesterTopics.filter((t) => t.status?.toLowerCase() === "inactive").length;
      const other = semesterTopics.length - active - inactive;

      return {
        name: `${s.term} ${s.year}`,
        Active: active,
        Inactive: inactive,
        Other: other,
      };
    });
  }, [semesters, topics]);

  return (
    <div className="p-4 bg-white rounded-2xl shadow space-y-4">
      <h3 className="text-xl font-semibold">Topics by Semester & Status</h3>

      <select
        className="border p-2 rounded w-full max-w-xs"
        value={selectedSemesterId || ""}
        onChange={(e) => setSelectedSemesterId(e.target.value)}
      >
        {semesters.map((s) => (
          <option key={s.id} value={s.id}>
            {s.term} {s.year} ({s.code})
          </option>
        ))}
      </select>

      {/* Biểu đồ */}
      <div className="w-full h-64">
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Active" stackId="a" fill="#f97316" />
            <Bar dataKey="Inactive" stackId="a" fill="#9ca3af" />
            <Bar dataKey="Other" stackId="a" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {loading ? (
        <p>Loading topics...</p>
      ) : topics.length === 0 ? (
        <p>No topics for this semester.</p>
      ) : (
        <ul className="space-y-2">
          {topics.map((t) => (
            <li key={t.id} className="p-2 border rounded hover:bg-gray-50">
              <h4 className="font-medium">{t.name}</h4>
              <p className="text-gray-500 text-sm">{t.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
