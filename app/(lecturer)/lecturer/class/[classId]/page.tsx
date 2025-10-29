"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, User, Users, Layers, Pen, UserPlus, Trash2 } from "lucide-react";
import { useClassGroupsWithMembers, useDeleteGroup, useRemoveMemberFromGroup, useUpdateGroup } from "@/hooks/useGroup";
import { useClassStudents } from "@/hooks/useClass";
import { useToast } from "@/hooks/use-toast";
import { Group } from "@/lib/api/services/fetchGroup";
import { TableSkeleton } from "@/components/ui/table-skeleton";

export default function ClassStudentsPage() {
  const { classId } = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"students" | "groups">("students");
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);
  const { toast } = useToast();
  const updateGroupMutation = useUpdateGroup(classId as string);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const {
    studentsData,
    isLoading: isLoadingStudents,
    isError: isErrorStudents,
    error: studentError,
  } = useClassStudents(classId as string);

  const classInfo = studentsData?.[0];
  const students = classInfo?.students || [];
  const removeMemberMutation = useRemoveMemberFromGroup(classId as string);
  const deleteGroupMutation = useDeleteGroup(classId as string);

  // ✅ Hook mới: lấy nhóm kèm members
  const {
    data: groupsWithMembers,
    isLoading: isLoadingGroups,
    isError: isErrorGroups,
    error: groupError,
  } = useClassGroupsWithMembers(classId as string);

  // ❌ Ẩn nhóm bị xóa (Inactive)
  const groups = (groupsWithMembers || []).filter((g) => g.status !== "Inactive");

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
      return (
        <div className="p-6">
          <div className="grid gap-4">
            <TableSkeleton cols={1} rows={2} />
            <TableSkeleton cols={1} rows={2} />
          </div>
        </div>
      );

    if (isErrorGroups) {
      toast({
        title: "❌ Lỗi tải nhóm",
        description: (groupError as Error)?.message || "Không thể tải danh sách nhóm.",
        variant: "destructive",
      });
      return (
        <div className="text-center text-red-500 py-10">
          {(groupError as Error)?.message || "Không thể tải danh sách nhóm."}
        </div>
      );
    }
  }

  return (
    <section className="bg-white rounded-3xl p-8 shadow-xl border border-orange-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 transition"
            aria-label="Back"
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

        {/* Tabs + New Group */}
        <div className="flex items-center gap-4">
          <div className="flex gap-2 bg-orange-50 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("students")}
              className={`px-4 py-2 rounded-md font-medium ${
                activeTab === "students" ? "bg-orange-500 text-white shadow" : "text-orange-700"
              }`}
            >
              Students
            </button>

            <button
              onClick={() => setActiveTab("groups")}
              className={`px-4 py-2 rounded-md font-medium ${
                activeTab === "groups" ? "bg-orange-500 text-white shadow" : "text-orange-700"
              }`}
            >
              Groups
            </button>
          </div>

          {activeTab === "groups" && (
            <button
              onClick={() => router.push(`/lecturer/class/${classId}/create`)}
              className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
            >
              + New Group
            </button>
          )}
        </div>
      </div>

      {/* Tab Content: Card-based, orange-first design */}
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
        <div className="flex flex-col gap-4">
          {groups.map((g, index) => (
            <div
              key={g.id}
              className="rounded-2xl p-4 bg-gradient-to-r from-white via-orange-50 to-white border border-orange-100 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className="w-12 h-12 flex items-center justify-center rounded-lg text-white font-semibold"
                    style={{ background: "linear-gradient(135deg,#ffd7b5,#ff9f43)" }}
                  >
                    {g.name
                      ?.split(" ")
                      .map((t) => t[0])
                      .slice(0, 2)
                      .join("")}
                  </div>

                  <div className="min-w-0">
                    <div className="text-lg font-semibold text-orange-700 truncate">{g.name}</div>
                    <div className="text-xs text-gray-500 truncate">{g.description || "Không có mô tả"}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Created: {new Date(g.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/lecturer/class/${classId}/${g.id}/add-member`);
                    }}
                    className="p-2 rounded-md bg-white border border-orange-100 text-orange-600 hover:bg-orange-50 transition"
                    title="Add member"
                  >
                    <UserPlus className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingGroup(g);
                      setEditName(g.name);
                      setEditDescription(g.description);
                    }}
                    className="p-2 rounded-md bg-white border border-orange-100 text-orange-600 hover:bg-orange-50 transition"
                    title="Edit group"
                  >
                    <Pen className="w-4 h-4" />
                  </button>

                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (!confirm(`Bạn có chắc muốn xóa nhóm "${g.name}" không?`)) return;
                      try {
                        await deleteGroupMutation.mutateAsync(g.id);
                        toast({
                          title: "🗑️ Xóa nhóm thành công",
                          description: `${g.name} đã bị xóa.`,
                        });
                      } catch (err: unknown) {
                        toast({
                          title: "❌ Lỗi xóa nhóm",
                          description: err instanceof Error ? err.message : "Không thể xóa nhóm này.",
                          variant: "destructive",
                        });
                      }
                    }}
                    className="p-2 rounded-md bg-white border border-orange-100 text-red-500 hover:bg-red-50 transition"
                    title="Delete group"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setExpandedGroupId((prev) => (prev === g.id ? null : g.id))}
                    className="ml-2 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-sm"
                    title="Toggle members"
                  >
                    {expandedGroupId === g.id ? "Hide members" : `Members (${g.members?.length || 0})`}
                  </button>
                </div>
              </div>

              {expandedGroupId === g.id && (
                <div className="mt-4 bg-white border border-orange-50 rounded-xl p-3">
                  {g.members?.length ? (
                    <div className="flex flex-col gap-2">
                      {g.members.map((m, idx) => (
                        <div key={m.userId} className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className="w-9 h-9 flex items-center justify-center rounded-full text-white font-medium"
                              style={{ background: "linear-gradient(135deg,#ffd7b5,#ff9f43)" }}
                            >
                              {m.firstName?.[0] || "U"}
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-medium truncate">
                                {m.lastName} {m.firstName}
                              </div>
                              <div className="text-xs text-gray-400 truncate">
                                {m.studentId} • {m.email}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-xs text-gray-500">
                              <span
                                className={`px-2 py-1 rounded-full ${
                                  m.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {m.status}
                              </span>
                            </div>

                            <button
                              onClick={async () => {
                                try {
                                  await removeMemberMutation.mutateAsync({
                                    groupId: g.id,
                                    userId: m.userId,
                                  });
                                  toast({
                                    title: "🗑️ Xóa thành viên thành công",
                                    description: `${m.lastName} ${m.firstName} đã bị xóa khỏi nhóm ${g.name}.`,
                                  });
                                } catch (err: unknown) {
                                  toast({
                                    title: "❌ Lỗi xóa thành viên",
                                    description: err instanceof Error ? err.message : "Không thể xóa thành viên.",
                                    variant: "destructive",
                                  });
                                }
                              }}
                              className="text-sm px-3 py-1 rounded-md bg-red-50 text-red-500 hover:bg-red-100 transition"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 italic py-2">Nhóm này chưa có thành viên 😔</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal chỉnh sửa nhóm (logic unchanged, chỉ style nhẹ) */}
      {editingGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold text-orange-600 mb-4">Edit Group: {editingGroup.name}</h3>

            <label className="block mb-2 font-medium text-gray-700">Group Name</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <label className="block mb-2 font-medium text-gray-700">Description</label>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingGroup(null)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await updateGroupMutation.mutateAsync({
                      id: editingGroup.id,
                      name: editName,
                      description: editDescription,
                    });
                    toast({
                      title: "✅ Cập nhật thành công",
                      description: `${editName} đã được cập nhật.`,
                    });
                    setEditingGroup(null);
                  } catch (err: unknown) {
                    let errorMessage = "Không thể cập nhật nhóm.";

                    if (err instanceof Error) {
                      errorMessage = err.message;
                    }

                    toast({
                      title: "❌ Lỗi cập nhật nhóm",
                      description: errorMessage,
                      variant: "destructive",
                    });
                  }
                }}
                className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
