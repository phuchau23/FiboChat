"use client";

import { useState } from "react";
import { BookOpen, Mail, Edit2, Save, X } from "lucide-react";
import { useLecturerById } from "@/hooks/useLecturer";

export default function TeacherProfileInfo() {
  const lecturerId = "019a16cd-c027-7233-a8ce-66d75a707998"; // hoặc lấy từ user login
  const { data, isLoading, isError } = useLecturerById(lecturerId);
  const [editing, setEditing] = useState(false);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">Đang tải hồ sơ giảng viên...</div>
    );

  if (isError || !data?.data)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">Không thể tải hồ sơ giảng viên.</div>
    );

  const lecturer = data.data;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-6 mt-8">
      <div className="flex items-center gap-6">
        <img src="/avatar.png" alt="avatar" className="w-24 h-24 rounded-full object-cover" />
        <div>
          <h1 className="text-2xl font-bold">{lecturer.fullName}</h1>
          <p className="text-gray-700 flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> Giới tính: {lecturer.gender || "Chưa cập nhật"}
          </p>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
          >
            <Edit2 className="w-4 h-4" /> Chỉnh sửa
          </button>
        ) : (
          <>
            <button
              onClick={() => setEditing(false)}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              <Save className="w-4 h-4" /> Lưu
            </button>
            <button
              onClick={() => setEditing(false)}
              className="flex items-center gap-2 border px-4 py-2 rounded-lg text-gray-700"
            >
              <X className="w-4 h-4" /> Hủy
            </button>
          </>
        )}
      </div>
    </div>
  );
}
