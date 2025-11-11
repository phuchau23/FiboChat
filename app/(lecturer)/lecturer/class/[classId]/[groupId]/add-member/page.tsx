"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStudentsWithoutGroup } from "@/hooks/useClass";
import { useAddMembersToGroup } from "@/hooks/useGroup";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, UserPlus } from "lucide-react";

type Student = {
  id: string;
  studentId: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  status?: string | null;
};

export default function AddMemberPage() {
  const { classId, groupId } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const addMembersMutation = useAddMembersToGroup(classId as string);

  const { studentsData, isLoading, isError } = useStudentsWithoutGroup(
    classId as string
  );
  const students = (studentsData?.[0]?.students as Student[]) || [];

  const handleCheckboxChange = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAddMembers = async () => {
    if (selectedUserIds.length === 0) {
      toast({
        title: " Chưa chọn sinh viên",
        description: "Vui lòng chọn ít nhất một sinh viên để thêm vào nhóm.",
        variant: "destructive",
      });
      return;
    }

    try {
      await addMembersMutation.mutateAsync({
        groupId: groupId as string,
        userIds: selectedUserIds,
      });

      toast({
        title: " Thêm thành công",
        description: `${selectedUserIds.length} sinh viên đã được thêm vào nhóm.`,
      });

      router.push(`/lecturer/class/${classId}`);
    } catch (err: unknown) {
      toast({
        title: " Lỗi thêm thành viên",
        description:
          err instanceof Error
            ? err.message
            : "Không thể thêm sinh viên vào nhóm.",
        variant: "destructive",
      });
    }
  };

  if (isLoading)
    return (
      <div className="text-center text-orange-500 py-10">
        Đang tải danh sách sinh viên...
      </div>
    );

  if (isError)
    return (
      <div className="text-center text-red-500 py-10">
        Không thể tải danh sách sinh viên.
      </div>
    );

  return (
    <section className="bg-white rounded-3xl p-8 shadow-xl border border-orange-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-orange-500 hover:text-orange-600 transition"
        >
          <ArrowLeft className="h-5 w-5" /> Back
        </button>

        <h2 className="text-2xl font-bold text-orange-600 flex items-center gap-2">
          <UserPlus className="h-6 w-6 text-orange-400" /> Add Members to Group
        </h2>

        <div className="ml-auto hidden sm:flex items-center gap-3">
          <div className="text-sm text-gray-500">
            Available:{" "}
            <span className="font-medium text-orange-600">
              {students.length}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            Selected:{" "}
            <span className="font-medium text-orange-600">
              {selectedUserIds.length}
            </span>
          </div>
        </div>
      </div>

      {/* New UI: card / list style (no logic changed) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500 italic rounded-lg border border-dashed border-orange-100">
            🎓 Tất cả sinh viên trong lớp đều đã có nhóm.
          </div>
        ) : (
          students.map((s) => {
            const checked = selectedUserIds.includes(s.id);
            return (
              <label
                key={s.id}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition cursor-pointer
                  ${
                    checked
                      ? "bg-orange-50 border-orange-200 shadow-sm"
                      : "bg-white border-orange-100 hover:shadow-sm"
                  }`}
              >
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleCheckboxChange(s.id)}
                  className="w-5 h-5 accent-orange-500"
                />

                {/* Avatar & info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                      style={{
                        background: "linear-gradient(135deg,#ffb86b,#ff7a00)",
                      }}
                      aria-hidden
                    >
                      {s.firstName?.[0] || "U"}
                      {s.lastName?.[0] || ""}
                    </div>

                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-orange-700 truncate">
                        {s.lastName} {s.firstName}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        ID: {s.studentId}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-gray-600 truncate">
                    {s.email}
                  </div>
                </div>

                {/* Right actions / meta */}
                <div className="flex flex-col items-end gap-2">
                  <div
                    className={`text-xs px-2 py-1 rounded-full ${
                      s.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {s.status ?? "Unknown"}
                  </div>

                  <div className="text-xs text-gray-400">
                    {/* empty slot for future meta */}
                  </div>
                </div>
              </label>
            );
          })
        )}
      </div>

      {/* Footer - actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedUserIds([])}
            className="text-sm text-orange-600 px-3 py-2 rounded-md bg-orange-50 hover:bg-orange-100 transition"
          >
            Clear selection
          </button>

          <button
            onClick={() =>
              // keep behavior: navigating back to class page (no logic change)
              router.push(`/lecturer/class/${classId}`)
            }
            className="text-sm text-gray-500 px-3 py-2 rounded-md bg-white border border-gray-100 hover:shadow-sm transition"
          >
            Cancel
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500 hidden sm:block">
            Selected:{" "}
            <span className="font-medium text-orange-600">
              {selectedUserIds.length}
            </span>
          </div>
          <button
            onClick={handleAddMembers}
            disabled={addMembersMutation.isPending}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-60"
          >
            {addMembersMutation.isPending
              ? "Adding..."
              : "Add Selected Members"}
          </button>
        </div>
      </div>
    </section>
  );
}
