"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, User, Users, Layers, Pen, UserPlus, Trash2 } from "lucide-react";
import { useClassGroupsWithMembers, useDeleteGroup, useRemoveMemberFromGroup, useUpdateGroup } from "@/hooks/useGroup";
import { useClassStudents } from "@/hooks/useClass";
import { useToast } from "@/hooks/use-toast";
import { Group } from "@/lib/api/services/fetchGroup";
import { TableSkeleton } from "@/components/ui/table-skeleton";

/**
 * Local types to avoid `any`. These reflect fields used in this component.
 * We keep original variable names (students, groups, etc.) intact.
 */
interface StudentType {
  id: string;
  studentId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  status?: string;
}

interface MemberType {
  userId: string;
  studentId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  status?: string;
}

type GroupWithMembersType = Group & {
  members?: MemberType[];
};

export default function ClassStudentsPage() {
  const { classId } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"students" | "groups">("students");
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);
  const { toast } = useToast();
  const updateGroupMutation = useUpdateGroup(classId as string);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // NEW: state for custom delete modal (replace window.confirm)
  const [groupToDelete, setGroupToDelete] = useState<Group | null>(null);

  // --- Search / Sort / Pagination states (kept names simple and clear) ---
  const [searchQuery, setSearchQuery] = useState<string>(""); // đặt phía trên tab, áp dụng riêng theo tab
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // sort theo name tăng/giảm
  const [studentsPage, setStudentsPage] = useState<number>(1);
  const [groupsPage, setGroupsPage] = useState<number>(1);
  const PAGE_SIZE = 10;

  const {
    studentsData,
    isLoading: isLoadingStudents,
    isError: isErrorStudents,
    error: studentError,
  } = useClassStudents(classId as string);

  const classInfo = studentsData?.[0];
  // cast để TypeScript biết type (không đổi tên biến students)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const students = (classInfo?.students || []) as StudentType[];
  const tabParam = searchParams.get("tab");

  const removeMemberMutation = useRemoveMemberFromGroup(classId as string);
  const deleteGroupMutation = useDeleteGroup(classId as string);

  // Hook: groups with members
  const {
    data: groupsWithMembers,
    isLoading: isLoadingGroups,
    isError: isErrorGroups,
    error: groupError,
  } = useClassGroupsWithMembers(classId as string);

  // Lọc out những nhóm Inactive (giữ tên biến groups)
  const groups = ((groupsWithMembers || []) as GroupWithMembersType[]).filter((g) => g.status !== "Inactive");

  // Map studentId -> groupName (giữ logic cũ)
  const studentGroupMap: Record<string, string> = {};
  groups.forEach((g) => {
    g.members?.forEach((m) => {
      studentGroupMap[m.userId] = g.name;
    });
  });

  // --- Derived lists: filter (search) -> sort -> paginate ---
  // Students: search by studentId or name (lastName + firstName)
  const filteredSortedStudents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const filtered = q
      ? students.filter((s) => {
          const fullName = `${s.lastName ?? ""} ${s.firstName ?? ""}`.toLowerCase();
          return (s.studentId ?? "").toLowerCase().includes(q) || fullName.includes(q);
        })
      : [...students];

    filtered.sort((a, b) => {
      const nameA = `${a.lastName ?? ""} ${a.firstName ?? ""}`.trim().toLowerCase();
      const nameB = `${b.lastName ?? ""} ${b.firstName ?? ""}`.trim().toLowerCase();
      if (nameA < nameB) return sortOrder === "asc" ? -1 : 1;
      if (nameA > nameB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [students, searchQuery, sortOrder]);

  const totalStudentsPages = Math.max(1, Math.ceil(filteredSortedStudents.length / PAGE_SIZE));
  const pagedStudents = useMemo(() => {
    const page = Math.max(1, Math.min(studentsPage, totalStudentsPages));
    const start = (page - 1) * PAGE_SIZE;
    return filteredSortedStudents.slice(start, start + PAGE_SIZE);
  }, [filteredSortedStudents, studentsPage, totalStudentsPages]);

  // Groups: search by group name or description
  const filteredSortedGroups = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const filtered = q
      ? groups.filter((g) => {
          return (g.name ?? "").toLowerCase().includes(q) || (g.description ?? "").toLowerCase().includes(q);
        })
      : [...groups];

    filtered.sort((a, b) => {
      const nameA = (a.name ?? "").toLowerCase();
      const nameB = (b.name ?? "").toLowerCase();
      if (nameA < nameB) return sortOrder === "asc" ? -1 : 1;
      if (nameA > nameB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [groups, searchQuery, sortOrder]);

  const totalGroupsPages = Math.max(1, Math.ceil(filteredSortedGroups.length / PAGE_SIZE));
  const pagedGroups = useMemo(() => {
    const page = Math.max(1, Math.min(groupsPage, totalGroupsPages));
    const start = (page - 1) * PAGE_SIZE;
    return filteredSortedGroups.slice(start, start + PAGE_SIZE);
  }, [filteredSortedGroups, groupsPage, totalGroupsPages]);
  React.useEffect(() => {
    if (tabParam) setActiveTab(tabParam as "students" | "groups");

    if (typeof window !== "undefined") {
      // Check for cross-page flags set by other pages (create/edit/delete flows)
      const createdFlag = localStorage.getItem("groupCreated");
      const deletedFlag = localStorage.getItem("groupDeleted");
      const updatedFlag = localStorage.getItem("groupUpdated");

      if (createdFlag === "true") {
        toast({
          title: "Nhóm đã được tạo thành công",
          description: "Nhóm mới đã được thêm vào danh sách.",
        });
        localStorage.removeItem("groupCreated");
      }

      if (deletedFlag === "true") {
        toast({
          title: "Nhóm đã bị xóa",
          description: "Một nhóm đã được xóa.",
        });
        localStorage.removeItem("groupDeleted");
      }

      if (updatedFlag === "true") {
        toast({
          title: "Nhóm đã được cập nhật",
          description: "Thay đổi của nhóm đã được lưu.",
        });
        localStorage.removeItem("groupUpdated");
      }
    }
  }, [tabParam, toast]);

  // Reset page when search or tab changes
  React.useEffect(() => {
    setStudentsPage(1);
    setGroupsPage(1);
  }, [searchQuery, activeTab]);

  // Loading / Error UI (giữ logic cũ, nhưng dùng filtered/paged lists)
  if (activeTab === "students") {
    if (isLoadingStudents || isLoadingGroups)
      return <div className="text-center text-orange-500 py-10 animate-pulse">Loading student list...</div>;

    if (isErrorStudents)
      return (
        <div className="text-center text-red-500 py-10">
          {(studentError as Error)?.message || "Unable to load student list."}
        </div>
      );
  }

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

        {/* Search + Tabs + New Group */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          {/* Search (đặt trước tabs, áp dụng riêng theo tab) */}
          <div className="w-full sm:w-80">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === "students" ? "Search by name or student ID..." : "Search by name or group description..."
              }
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>

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
      </div>

      {/* Sort control (shared) */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
            className="px-3 py-1 rounded-md bg-orange-50 text-orange-700 border border-orange-100 hover:bg-orange-100 transition"
            title="Toggle sort order"
          >
            Sort: {sortOrder === "asc" ? "A → Z" : "Z → A"}
          </button>
          <div className="text-sm text-gray-500">
            {activeTab === "students"
              ? `${filteredSortedStudents.length} students`
              : `${filteredSortedGroups.length} groups`}
          </div>
        </div>

        {/* Pagination summary */}
        <div className="text-sm text-gray-500">
          {activeTab === "students"
            ? `Trang ${studentsPage} / ${totalStudentsPages}`
            : `Trang ${groupsPage} / ${totalGroupsPages}`}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "students" ? (
        pagedStudents.length === 0 ? (
          <div className="text-center text-gray-500 py-12 italic text-lg">This class has no students yet</div>
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
                {pagedStudents.map((s, index) => {
                  // compute global index (1-based) for display
                  const globalIndex = (studentsPage - 1) * PAGE_SIZE + index + 1;
                  return (
                    <tr key={s.id} className="group border-t transition">
                      <td className="py-3 px-4 group-hover:bg-orange-50">{globalIndex}</td>
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
                      <td className="py-2 px-1 group-hover:bg-orange-50">{studentGroupMap[s.id] || "No groups yet"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination controls for students */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Show {(studentsPage - 1) * PAGE_SIZE + 1} -{" "}
                {Math.min(studentsPage * PAGE_SIZE, filteredSortedStudents.length)} of {filteredSortedStudents.length}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStudentsPage((p) => Math.max(1, p - 1))}
                  disabled={studentsPage <= 1}
                  className="px-3 py-1 rounded-md bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                >
                  Prev
                </button>

                {/* quick page numbers (small) */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalStudentsPages }, (_, i) => i + 1)
                    .slice(0, 5)
                    .map((p) => (
                      <button
                        key={p}
                        onClick={() => setStudentsPage(p)}
                        className={`px-3 py-1 rounded-md border ${
                          p === studentsPage ? "bg-orange-500 text-white border-orange-500" : "bg-white"
                        }`}
                      >
                        {p}
                      </button>
                    ))}

                  {/* if more pages, show ellipsis and last page */}
                  {totalStudentsPages > 5 && (
                    <>
                      <span className="px-2">…</span>
                      <button
                        onClick={() => setStudentsPage(totalStudentsPages)}
                        className="px-3 py-1 rounded-md border bg-white"
                      >
                        {totalStudentsPages}
                      </button>
                    </>
                  )}
                </div>

                <button
                  onClick={() => setStudentsPage((p) => Math.min(totalStudentsPages, p + 1))}
                  disabled={studentsPage >= totalStudentsPages}
                  className="px-3 py-1 rounded-md bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )
      ) : pagedGroups.length === 0 ? (
        <div className="text-center text-gray-500 py-12 italic text-lg">This class does not have any groups yet</div>
      ) : (
        <div className="flex flex-col gap-4">
          {pagedGroups.map((g, index) => {
            const globalIndex = (groupsPage - 1) * PAGE_SIZE + index + 1;
            return (
              <div
                key={g.id}
                className="rounded-2xl p-4 bg-gradient-to-r from-white via-orange-50 to-white border border-orange-100 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className="w-12 h-12 flex items-center justify-center rounded-lg text-white font-semibold"
                      style={{
                        background: "linear-gradient(135deg,#ffd7b5,#ff9f43)",
                      }}
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
                      <div className="text-xs text-gray-400 mt-1">#{globalIndex}</div>
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

                    {/* REPLACED: native confirm -> open custom modal */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setGroupToDelete(g);
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
                        {g.members.map((m) => (
                          <div key={m.userId} className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className="w-9 h-9 flex items-center justify-center rounded-full text-white font-medium"
                                style={{
                                  background: "linear-gradient(135deg,#ffd7b5,#ff9f43)",
                                }}
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
                      <div className="text-center text-gray-500 italic py-2">This group has no members yet</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Pagination controls for groups */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Show {(groupsPage - 1) * PAGE_SIZE + 1} - {Math.min(groupsPage * PAGE_SIZE, filteredSortedGroups.length)}{" "}
              of {filteredSortedGroups.length}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setGroupsPage((p) => Math.max(1, p - 1))}
                disabled={groupsPage <= 1}
                className="px-3 py-1 rounded-md bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
              >
                Prev
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalGroupsPages }, (_, i) => i + 1)
                  .slice(0, 5)
                  .map((p) => (
                    <button
                      key={p}
                      onClick={() => setGroupsPage(p)}
                      className={`px-3 py-1 rounded-md border ${
                        p === groupsPage ? "bg-orange-500 text-white border-orange-500" : "bg-white"
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                {totalGroupsPages > 5 && (
                  <>
                    <span className="px-2">…</span>
                    <button
                      onClick={() => setGroupsPage(totalGroupsPages)}
                      className="px-3 py-1 rounded-md border bg-white"
                    >
                      {totalGroupsPages}
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={() => setGroupsPage((p) => Math.min(totalGroupsPages, p + 1))}
                disabled={groupsPage >= totalGroupsPages}
                className="px-3 py-1 rounded-md bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal chỉnh sửa nhóm (logic giữ y nguyên) */}
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
                    // show immediate toast on update success
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

      {/* Custom delete confirmation modal (replaces window.confirm) */}
      {groupToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setGroupToDelete(null)} />
          <div className="relative bg-white rounded-xl shadow-lg p-6 w-full max-w-md z-10">
            <h3 className="text-lg font-semibold text-red-600 mb-2">Xác nhận xóa</h3>
            <p className="text-sm text-gray-700 mb-4">
              Are you sure you want to delete group <span className="font-medium">{groupToDelete.name}</span> ? This
              action does not can be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setGroupToDelete(null)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await deleteGroupMutation.mutateAsync(groupToDelete.id);
                    toast({
                      title: "🗑️ Xóa nhóm thành công",
                      description: `${groupToDelete.name} đã bị xóa.`,
                    });
                    setGroupToDelete(null);
                    // optionally: localStorage.setItem("groupDeleted","true");
                  } catch (err: unknown) {
                    toast({
                      title: "❌ Lỗi xóa nhóm",
                      description: err instanceof Error ? err.message : "Không thể xóa nhóm này.",
                      variant: "destructive",
                    });
                  }
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
