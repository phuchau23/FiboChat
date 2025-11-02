"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Mail, User, Shield, Edit2, Save, X, ImageUp, Tag, UsersIcon, BookOpen, Users } from "lucide-react";
import { type ClassMember } from "@/utils/data";
import ChangePasswordDialog from "./ChangePasswordDialog";
import { useUpdateProfile, useUserProfile } from "@/hooks/useUser";
import { UpdateProfilePayload } from "@/lib/api/services/fetchUser";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { useClassEnrollmentByUser, useGroupMembers } from "@/hooks/useGroupEnrollment";
import { getCookie } from "cookies-next/client";
import { decodeToken } from "@/utils/jwt";

interface ProfileForm {
  firstname: string;
  lastname: string;
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
  const { data, isLoading, isError } = useUserProfile();
  const token = getCookie("auth-token");
  let userId: string | undefined = undefined;

  if (token) {
    const decoded = decodeToken(token.toString());
    userId = decoded?.nameid; // 👈 đây là ID thật của user
  }
  const { data: enrollment, isLoading: loadingEnrollment } = useClassEnrollmentByUser(userId);
  const groupId = enrollment?.group?.id;
  const { members, isLoading: loadingMembers } = useGroupMembers(groupId);

  const updateProfileMutation = useUpdateProfile();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [form, setForm] = useState<ProfileForm>({
    firstname: "",
    lastname: "",
    email: "",
    phoneNumber: "",
    studentID: "",
    dateOfBirth: "",
    sex: "",
    address: "",
    avatarUrl: "/avatar.png",
    status: "online",
  });

  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "class">("profile");

  // --- Khi có data từ API, set form ---
  useEffect(() => {
    if (data?.data) {
      const p = data.data;
      setForm({
        firstname: p.firstname,
        lastname: p.lastname,
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>, type: "avatar" | "background") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setForm((prev) => ({
      ...prev,
      [type === "avatar" ? "avatarUrl" : "backgroundUrl"]: URL.createObjectURL(file),
      ...(type === "avatar" ? { AvatarFile: file } : {}),
    }));
  };

  const handleEdit = () => setEditing(true);
  const handleCancel = () => setEditing(false);

  const handleSave = async () => {
    try {
      const payload: UpdateProfilePayload = {
        firstname: form.firstname.trim(),
        lastname: form.lastname.trim(),
        phoneNumber: form.phoneNumber,
        dateOfBirth: form.dateOfBirth,
        sex: form.sex,
        address: form.address,
        ...(form.AvatarFile ? { AvatarFile: form.AvatarFile } : {}),
      };

      const filteredPayload = Object.fromEntries(
        Object.entries(payload).filter(([_, v]) => v !== "" && v !== undefined)
      ) as UpdateProfilePayload;

      await updateProfileMutation.mutateAsync(filteredPayload);

      queryClient.setQueryData(["userProfile"], {
        data: {
          ...data?.data,
          ...filteredPayload,
        },
      });

      setEditing(false);
      toast({
        description: "Cập nhật hồ sơ thành công!",
      });
    } catch (error: unknown) {
      console.error("Update profile failed:", error);

      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };

      const message = err?.response?.data?.message || err?.message || "Cập nhật hồ sơ thất bại.";

      toast({
        description: message,
        variant: "destructive",
      });
    }
  };

  // --- Render ---
  if (isLoading) {
    // ✅ Thêm skeleton loading
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="w-full max-w-6xl">
          <TableSkeleton rows={6} cols={4} />
        </div>
      </div>
    );
  }

  if (isError) return <p className="text-red-500 text-center text-md font-serif">Lỗi khi tải dữ liệu!</p>;
  // --- Render ---
  return (
    <div className="min-h-screen bg-muted/30">
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center text-gray-500">Đang tải thông tin hồ sơ...</div>
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
                <ImageUp className="w-4 h-4" /> {uploading ? "Đang tải..." : "Đổi ảnh bìa"}
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
                    <img src={form.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
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
                  <h1 className="text-3xl font-bold text-gray-900">{`${form.firstname} ${form.lastname}`.trim()}</h1>
                  <p className="text-gray-500 text-lg">Student ID: {form.studentID}</p>
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
                  {showChangePassword && <ChangePasswordDialog onClose={() => setShowChangePassword(false)} />}
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
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Thông tin cá nhân</h2>

                  {/* Thông tin cá nhân */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Cột trái */}
                    <div className="flex flex-col space-y-6">
                      {/* Họ */}
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">Họ</label>
                        {editing ? (
                          <input
                            type="text"
                            name="firstname"
                            value={form.firstname}
                            onChange={handleChange}
                            placeholder="Nhập họ"
                            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                        ) : (
                          <p className="text-gray-900 text-base font-medium">{form.firstname || "Chưa cập nhật"}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="text"
                          name="email"
                          value={form.email}
                          disabled
                          className="px-4 py-2 border border-gray-200 bg-gray-100 text-gray-500 rounded-lg shadow-sm cursor-not-allowed"
                        />
                      </div>

                      {/* Ngày sinh */}
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                        {editing ? (
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={form.dateOfBirth}
                            onChange={handleChange}
                            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                        ) : (
                          <p className="text-gray-900 text-base font-medium">
                            {form.dateOfBirth
                              ? new Date(form.dateOfBirth).toLocaleDateString("vi-VN")
                              : "Chưa cập nhật"}
                          </p>
                        )}
                      </div>

                      {/* Giới tính */}
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">Giới tính</label>
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
                          <p className="text-gray-900 text-base font-medium">{form.sex || "Chưa cập nhật"}</p>
                        )}
                      </div>
                    </div>

                    {/* Cột phải */}
                    <div className="flex flex-col space-y-6">
                      {/* Tên */}
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">Tên</label>
                        {editing ? (
                          <input
                            type="text"
                            name="lastname"
                            value={form.lastname}
                            onChange={handleChange}
                            placeholder="Nhập tên"
                            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                        ) : (
                          <p className="text-gray-900 text-base font-medium">{form.lastname || "Chưa cập nhật"}</p>
                        )}
                      </div>

                      {/* Mã sinh viên */}
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">Mã sinh viên</label>
                        <input
                          type="text"
                          name="studentID"
                          value={form.studentID}
                          disabled
                          className="px-4 py-2 border border-gray-200 bg-gray-100 text-gray-500 rounded-lg shadow-sm cursor-not-allowed"
                        />
                      </div>

                      {/* Số điện thoại */}
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
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
                          <p className="text-gray-900 text-base font-medium">{form.phoneNumber || "Chưa cập nhật"}</p>
                        )}
                      </div>

                      {/* Địa chỉ */}
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
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
                          <p className="text-gray-900 text-base font-medium">{form.address || "Chưa cập nhật"}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Users className="w-8 h-8 mr-3 text-orange-600" />
                    Thành viên trong nhóm
                  </h2>
                  <hr className="mb-8 border-t-2 border-orange-500/30" />

                  {loadingEnrollment ? (
                    <p className="text-gray-500 text-lg animate-pulse">Đang tải thông tin lớp...</p>
                  ) : enrollment ? (
                    <div className="space-y-10">
                      {/* Thông tin lớp học và Nhóm (Sử dụng cấu trúc 2 cột nếu có nhóm) */}
                      <div className={`grid ${enrollment.group ? "lg:grid-cols-2 gap-8" : "grid-cols-1"} `}>
                        {/* 📘 Lớp học */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md transition hover:shadow-lg">
                          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <BookOpen className="w-5 h-5 mr-2 text-orange-600" />
                            Thông tin lớp học
                          </h3>
                          <div className="text-gray-700 space-y-3">
                            <p className="flex justify-between items-center border-b pb-2">
                              <span className="font-medium text-gray-600 flex items-center">
                                <Tag className="w-4 h-4 mr-2 text-orange-500" />
                                Mã lớp:
                              </span>
                              <span className="font-semibold text-gray-900">{enrollment.class.code}</span>
                            </p>
                            <p className="flex justify-between items-center border-b pb-2">
                              <span className="font-medium text-gray-600 flex items-center">
                                <User className="w-4 h-4 mr-2 text-orange-500" />
                                Giảng viên:
                              </span>
                              <span className="font-semibold text-gray-900">{enrollment.class.lecturer.fullName}</span>
                            </p>
                            <p className="flex justify-between items-center">
                              <span className="font-medium text-gray-600 flex items-center">
                                <BookOpen className="w-4 h-4 mr-2 text-orange-500" />
                                Học kỳ:
                              </span>
                              <span className="font-semibold text-gray-900">
                                {enrollment.class.semester.code} ({enrollment.class.semester.year})
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* 👥 Nhóm của bạn */}
                        {enrollment.group && (
                          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md transition hover:shadow-lg">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                              <UsersIcon className="w-5 h-5 mr-2 text-orange-600" />
                              Nhóm hiện tại
                            </h3>
                            <div className="text-gray-700 space-y-3">
                              <p className="flex justify-between items-center border-b pb-2">
                                <span className="font-medium text-gray-600 flex items-center">
                                  <Tag className="w-4 h-4 mr-2 text-orange-500" />
                                  Tên nhóm:
                                </span>
                                <span className="font-semibold text-gray-900">{enrollment.group.name}</span>
                              </p>
                              <div className="pt-2">
                                <p className="font-medium text-gray-600 mb-1 flex items-center">
                                  <UsersIcon className="w-4 h-4 mr-2 text-orange-500" />
                                  Mô tả:
                                </p>
                                <p className="text-gray-800 italic bg-orange-50 p-3 rounded-lg border border-orange-200">
                                  {enrollment.group.description || "Không có mô tả"}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <hr className="border-t-2 border-gray-100" />

                      {/* 🧑‍🎓 Thành viên nhóm */}
                      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xl">
                        <h3 className="text-2xl font-bold text-gray-800 mb-5 flex items-center">
                          <User className="w-6 h-6 mr-3 text-orange-600" />
                          Danh sách thành viên nhóm
                        </h3>

                        {loadingMembers ? (
                          <p className="text-gray-500 text-lg animate-pulse">Đang tải danh sách thành viên...</p>
                        ) : members && members.length > 0 ? (
                          <ul className="divide-y divide-gray-100 border-t border-b border-gray-200">
                            {members.map((m) => (
                              <li
                                key={m.id}
                                className="flex items-center justify-between py-4 px-3 hover:bg-orange-50/50 rounded-xl transition duration-200 ease-in-out"
                              >
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 mr-4">
                                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                      {m.name[0]}
                                    </div>
                                  </div>
                                  <div>
                                    <p className="font-bold text-lg text-gray-900">{m.name}</p>
                                    <div className="text-sm text-gray-500 flex items-center space-x-3 mt-1">
                                      <span className="font-medium text-gray-700 flex items-center">
                                        <Tag className="w-3 h-3 mr-1" />
                                        {m.studentID}
                                      </span>
                                      <span className="flex items-center">
                                        <Mail className="w-3 h-3 mr-1" />
                                        {m.email}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <span
                                  className={`text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap
                        ${
                          m.role === "Nhóm trưởng" ? "bg-orange-500 text-white shadow-sm" : "bg-blue-100 text-blue-700"
                        }`}
                                >
                                  {m.role}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="bg-yellow-50 p-4 rounded-lg text-center border border-yellow-200">
                            <p className="text-lg text-yellow-700">Chưa có thành viên nào trong nhóm.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-50 p-4 rounded-lg text-center border border-red-200">
                      <p className="text-lg text-red-700 font-medium">Không có dữ liệu lớp hoặc nhóm để hiển thị.</p>
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
