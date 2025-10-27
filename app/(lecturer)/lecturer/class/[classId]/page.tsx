"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, User, Users, Layers } from "lucide-react";
import { useClassGroupsWithMembers } from "@/hooks/useGroup";
import { useClassStudents } from "@/hooks/useClass";

export default function ClassStudentsPage() {
  const { classId } = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"students" | "groups">("students");

  const {
    studentsData,
    isLoading: isLoadingStudents,
    isError: isErrorStudents,
    error: studentError,
  } = useClassStudents(classId as string);

  const classInfo = studentsData?.[0];
  const students = classInfo?.students || [];

  // ✅ Hook mới: lấy nhóm kèm members
  const {
    data: groupsWithMembers,
    isLoading: isLoadingGroups,
    isError: isErrorGroups,
    error: groupError,
  } = useClassGroupsWithMembers(classId as string);

  const groups = groupsWithMembers || [];

  // Map studentId -> groupName
  const studentGroupMap: Record<string, string> = {};
  groups.forEach((g) => {
    g.members?.forEach((m) => {
      studentGroupMap[m.userId] = g.name;
    });
  });

  // Loading/Error chung cho tab Students
  if (activeTab === "students") {
    if (isLoadingStudents || isLoadingGroups)
      return <div className="text-center text-orange-500 py-10 animate-pulse">Đang tải danh sách sinh viên...</div>;

    if (isErrorStudents)
      return (
        <div className="text-center text-red-500 py-10">
          {(studentError as Error)?.message || "Không thể tải danh sách sinh viên."}
        </div>
      );
  }

  // Loading/Error chung cho tab Groups
  if (activeTab === "groups") {
    if (isLoadingGroups)
      return <div className="text-center text-orange-500 py-10 animate-pulse">Đang tải danh sách nhóm...</div>;

    if (isErrorGroups)
      return (
        <div className="text-center text-red-500 py-10">
          {(groupError as Error)?.message || "Không thể tải danh sách nhóm."}
        </div>
      );
  }

  return (
    <section className="bg-white rounded-3xl p-8 shadow-xl border border-orange-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-orange-500 hover:text-orange-600 transition"
          >
            <ArrowLeft className="h-5 w-5" /> Back
          </button>
          <h2 className="text-2xl font-bold text-orange-600 flex items-center gap-2">
            {activeTab === "students" ? (
              <>
                <Users className="h-6 w-6 text-orange-400" /> Students in {classInfo?.code}
              </>
            ) : (
              <>
                <Layers className="h-6 w-6 text-orange-400" /> Groups in {classInfo?.code}
              </>
            )}
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("students")}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === "students" ? "bg-orange-500 text-white" : "bg-orange-100 text-orange-700"
            }`}
          >
            Students
          </button>
          <button
            onClick={() => setActiveTab("groups")}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === "groups" ? "bg-orange-500 text-white" : "bg-orange-100 text-orange-700"
            }`}
          >
            Groups
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "students" ? (
        students.length === 0 ? (
          <div className="text-center text-gray-500 py-12 italic text-lg">Lớp này chưa có sinh viên 😔</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-fixed w-full border-collapse">
              <thead className="bg-orange-100 text-orange-700">
                <tr>
                  <th className="w-10 py-3 px-4 text-left">#</th>
                  <th className="w-32 py-3 px-4 text-left">Student ID</th>
                  <th className="w-48 py-3 px-4 text-left">Name</th>
                  <th className="w-32 py-3 px-4 text-left">Status</th>
                  <th className="w-64 py-3 px-4 text-left">Email</th>
                  <th className="w-48 py-3 px-4 text-left">Group</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, index) => (
                  <tr key={s.id} className="group border-t transition">
                    <td className="py-3 px-4 group-hover:bg-orange-50">{index + 1}</td>
                    <td className="py-3 px-4 font-medium text-orange-600 group-hover:bg-orange-50">{s.studentId}</td>
                    <td className="py-3 px-4 flex items-center gap-2 group-hover:bg-orange-50">
                      <User className="h-4 w-4 text-orange-400" />
                      <span className="truncate block">
                        {s.lastName} {s.firstName}
                      </span>
                    </td>
                    <td className="py-2 px-1 group-hover:bg-orange-50">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          s.status === "Active" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="py-2 px-1 group-hover:bg-orange-50">
                      <span className="truncate block">{s.email}</span>
                    </td>
                    <td className="py-2 px-1 group-hover:bg-orange-50">{studentGroupMap[s.id] || "Chưa có nhóm"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : groups.length === 0 ? (
        <div className="text-center text-gray-500 py-12 italic text-lg">Lớp này chưa có nhóm nào 😔</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-fixed w-full border-collapse">
            <thead className="bg-orange-100 text-orange-700">
              <tr>
                <th className="w-10 py-3 px-4 text-left">#</th>
                <th className="w-48 py-3 px-4 text-left">Group Name</th>
                <th className="w-64 py-3 px-4 text-left">Description</th>
                <th className="w-32 py-3 px-4 text-left">Created At</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((g, index) => (
                <tr key={g.id} className="group border-t transition">
                  <td className="py-3 px-4 group-hover:bg-orange-50">{index + 1}</td>
                  <td className="py-3 px-4 font-medium text-orange-600 group-hover:bg-orange-50">{g.name}</td>
                  <td className="py-3 px-4 group-hover:bg-orange-50">{g.description}</td>
                  <td className="py-3 px-4 group-hover:bg-orange-50">{new Date(g.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
