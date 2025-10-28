"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Mail, User, Shield, Edit2, Save, X, ImageUp } from "lucide-react";
import { type ClassMember } from "@/utils/data";
import ChangePasswordDialog from "./ChangePasswordDialog";
import { useUpdateProfile, useUserProfile } from "@/hooks/useUser";
import { UpdateProfilePayload } from "@/lib/api/services/fetchUser";
import { useQueryClient } from "@tanstack/react-query";
interface ProfileForm {
  firstname: string;
  lastname: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  studentID: string;
  dateOfBirth: string;
  sex: string;
  address: string;
  avatarUrl: string;
  backgroundUrl?: string;
  status: "online" | "offline";
  AvatarFile?: File;
}

export default function ProfileInfo() {
  // --- Gọi API hồ sơ thật ---
  const { data, isLoading, isError } = useUserProfile();
  const updateProfileMutation = useUpdateProfile();
  const queryClient = useQueryClient();

  // --- State chỉnh sửa ---
  const [form, setForm] = useState<ProfileForm>({
    firstname: "",
    lastname: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    studentID: "",
    dateOfBirth: "",
    sex: "",
    address: "",
    avatarUrl: "/avatar.png",
    status: "online" as "online" | "offline",
  });

  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "class">("profile");
  const [members, setMembers] = useState<ClassMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  // --- Khi có data từ API, set form ---
  useEffect(() => {
    if (data?.data) {
      const p = data.data;
      setForm({
        firstname: p.firstname,
        lastname: p.lastname,
        fullName: `${p.firstname} ${p.lastname}`.trim(),
        email: p.email,
        phoneNumber: p.phoneNumber || "",
        studentID: p.studentID,
        dateOfBirth: p.dateOfBirth || "",
        sex: p.sex || "",
        address: p.address || "",
        avatarUrl: p.avatarUrl || "/avatar.png",
        status: "online",
      });
    }
  }, [data]);

  // --- Handlers ---
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (
    e: ChangeEvent<HTMLInputElement>,
    type: "avatar" | "background"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setForm((prev) => ({
      ...prev,
      [type === "avatar" ? "avatarUrl" : "backgroundUrl"]:
        URL.createObjectURL(file),
      ...(type === "avatar" ? { AvatarFile: file } : {}),
    }));
  };

  const handleEdit = () => setEditing(true);
  const handleCancel = () => setEditing(false);

  const handleSave = async () => {
    try {
      const [firstname, ...lastnameParts] = form.fullName.trim().split(" ");
      const lastname = lastnameParts.join(" ");

      const payload: UpdateProfilePayload = {
        firstname,
        lastname,
        phoneNumber: form.phoneNumber,
        dateOfBirth: form.dateOfBirth,
        sex: form.sex,
        address: form.address,
        ...(form.AvatarFile ? { AvatarFile: form.AvatarFile } : {}),
      };

      // Lọc bỏ các giá trị rỗng
      const filteredPayload = Object.fromEntries(
        Object.entries(payload).filter(([_, v]) => v !== "" && v !== undefined)
      ) as UpdateProfilePayload;

      await updateProfileMutation.mutateAsync(filteredPayload);

      // Cập nhật cache user profile
      queryClient.setQueryData(["userProfile"], {
        data: {
          ...data?.data,
          ...filteredPayload,
        },
      });

      setEditing(false);
    } catch (error) {
      console.error("Update profile failed:", error);
    }
  };

  // --- Render ---
  return (
    <div className="min-h-screen bg-muted/30">
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center text-gray-500">
          Đang tải thông tin hồ sơ...
        </div>
      ) : isError || !data?.data ? (
        <div className="min-h-screen flex items-center justify-center text-red-500">
          Không thể tải hồ sơ người dùng.
        </div>
      ) : (
        <>
          {/* Ảnh nền */}
          <div
            className="relative h-48 md:h-64 w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${form.backgroundUrl})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/40" />
            {editing && (
              <label className="absolute bottom-3 right-3 bg-black/50 text-white px-3 py-2 rounded-lg text-sm cursor-pointer flex items-center gap-2 hover:bg-black/70">
                <ImageUp className="w-4 h-4" />{" "}
                {uploading ? "Đang tải..." : "Đổi ảnh bìa"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, "background")}
                  disabled={uploading}
                />
              </label>
            )}
          </div>

          {/* Container */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="relative -mt-20 md:-mt-24 bg-white border rounded-2xl shadow p-6">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow overflow-hidden">
                    <img
                      src={form.avatarUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {editing && (
                    <label className="absolute bottom-1 right-1 bg-black/60 text-white rounded-full p-2 cursor-pointer hover:bg-black/80 z-10">
                      <ImageUp className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, "avatar")}
                        disabled={uploading}
                      />
                    </label>
                  )}

                  <div
                    className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-white ${
                      form.status === "online" ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 space-y-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {form.fullName}
                  </h1>
                  <p className="text-gray-500 text-lg">
                    Student ID: {form.studentID}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Mail className="w-4 h-4" />
                      <span>{form.email}</span>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 w-full md:w-auto">
                  {!editing ? (
                    <>
                      <button
                        onClick={handleEdit}
                        className="flex items-center justify-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
                      >
                        <Edit2 className="w-4 h-4" /> Chỉnh sửa hồ sơ
                      </button>
                      <button
                        onClick={() => setShowChangePassword(true)}
                        className="flex items-center justify-center gap-2 border px-4 py-2 rounded-lg text-gray-700"
                      >
                        <Shield className="w-4 h-4" /> Đổi mật khẩu
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleSave}
                        className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                      >
                        <Save className="w-4 h-4" /> Lưu
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center justify-center gap-2 border px-4 py-2 rounded-lg text-gray-700"
                      >
                        <X className="w-4 h-4" /> Hủy
                      </button>
                    </>
                  )}
                  {showChangePassword && (
                    <ChangePasswordDialog
                      onClose={() => setShowChangePassword(false)}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-8 bg-white border rounded-2xl shadow p-6">
              <div className="border-b mb-6">
                <div className="flex gap-6">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`pb-3 font-semibold ${
                      activeTab === "profile"
                        ? "border-b-2 border-orange-600 text-orange-600"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    <User className="w-4 h-4 inline mr-2" />
                    Thông tin cá nhân
                  </button>
                  <button
                    onClick={() => setActiveTab("class")}
                    className={`pb-3 font-semibold ${
                      activeTab === "class"
                        ? "border-b-2 border-orange-600 text-orange-600"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    <Shield className="w-4 h-4 inline mr-2" />
                    Thông tin nhóm
                  </button>
                </div>
              </div>
              {activeTab === "profile" ? (
                <div className="space-y-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                    Thông tin cá nhân
                  </h2>

                  {/* Lưới thông tin */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Họ và tên */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-1">
                        Họ và tên
                      </label>
                      {editing ? (
                        <input
                          type="text"
                          name="fullName"
                          value={form.fullName}
                          onChange={handleChange}
                          placeholder="Nhập họ và tên của bạn"
                          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      ) : (
                        <p className="text-gray-900 text-base font-medium">
                          {form.fullName || "Chưa cập nhật"}
                        </p>
                      )}
                    </div>

                    {/* Ngày sinh */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-1">
                        Ngày sinh
                      </label>
                      {editing ? (
                        <input
                          type="date"
                          name="dob"
                          value={form.dateOfBirth}
                          onChange={handleChange}
                          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      ) : (
                        <p className="text-gray-900 text-base font-medium">
                          {form.dateOfBirth
                            ? new Date(form.dateOfBirth).toLocaleDateString(
                                "vi-VN"
                              )
                            : "Chưa cập nhật"}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="text"
                        name="email"
                        value={form.email}
                        disabled
                        className="px-4 py-2 border border-gray-200 bg-gray-100 text-gray-500 rounded-lg shadow-sm cursor-not-allowed"
                      />
                    </div>

                    {/* Mã sinh viên */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-1">
                        Mã sinh viên
                      </label>
                      <input
                        type="text"
                        name="studentID"
                        value={form.studentID}
                        disabled
                        className="px-4 py-2 border border-gray-200 bg-gray-100 text-gray-500 rounded-lg shadow-sm cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Số điện thoại */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-1">
                        Số điện thoại
                      </label>
                      {editing ? (
                        <input
                          type="text"
                          name="phoneNumber"
                          value={form.phoneNumber}
                          onChange={handleChange}
                          placeholder="Nhập số điện thoại"
                          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      ) : (
                        <p className="text-gray-900 text-base font-medium">
                          {form.phoneNumber || "Chưa cập nhật"}
                        </p>
                      )}
                    </div>

                    {/* Giới tính */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-1">
                        Giới tính
                      </label>
                      {editing ? (
                        <select
                          name="sex"
                          value={form.sex}
                          onChange={handleChange}
                          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        >
                          <option value="">Chọn giới tính</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      ) : (
                        <p className="text-gray-900 text-base font-medium">
                          {form.sex || "Chưa cập nhật"}
                        </p>
                      )}
                    </div>

                    {/* Địa chỉ */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-1">
                        Địa chỉ
                      </label>
                      {editing ? (
                        <input
                          type="text"
                          name="address"
                          value={form.address}
                          onChange={handleChange}
                          placeholder="Nhập địa chỉ"
                          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      ) : (
                        <p className="text-gray-900 text-base font-medium">
                          {form.address || "Chưa cập nhật"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Thành viên trong nhóm
                  </h2>
                  {loadingMembers ? (
                    <p>Đang tải danh sách...</p>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {members.map((m) => (
                        <div
                          key={m.id}
                          className="flex items-center gap-3 border p-4 rounded-xl hover:bg-gray-50 transition"
                        >
                          <img
                            src={m.avatarUrl}
                            alt={m.fullName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-semibold">{m.fullName}</p>
                            <p className="text-xs text-orange-600">{m.role}</p>
                          </div>
                          <span
                            className={`ml-auto w-3 h-3 rounded-full ${
                              m.status === "online"
                                ? "bg-green-500"
                                : "bg-gray-400"
                            }`}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
