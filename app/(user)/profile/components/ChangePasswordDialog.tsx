"use client";

import { useState } from "react";
import { Shield, X, Save, Eye, EyeOff } from "lucide-react";
import { useChangePassword } from "@/hooks/useChangePassword";
import { useToast } from "@/hooks/use-toast";

interface ChangePasswordDialogProps {
  onClose: () => void;
}

export default function ChangePasswordDialog({ onClose }: ChangePasswordDialogProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { toast } = useToast();
  const { mutate, isPending } = useChangePassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: "Lỗi xác nhận mật khẩu",
        description: "❌ Mật khẩu xác nhận không khớp.",
        variant: "destructive",
      });
      return;
    }

    mutate(
      { oldPassword: currentPassword, newPassword, confirmPassword },
      {
        onSuccess: (res) => {
          if (res.success) {
            toast({
              title: "✅ Đổi mật khẩu thành công",
              description: res.message,
            });
            setTimeout(() => onClose(), 1200);
          } else {
            toast({
              title: "❌ Đổi mật khẩu thất bại",
              description: res.message,
              variant: "destructive",
            });
          }
        },
        onError: (err: unknown) => {
          let errorMessage = "Không thể đổi mật khẩu.";

          if (err instanceof Error) {
            errorMessage = err.message;
          } else if (
            typeof err === "object" &&
            err !== null &&
            "response" in err &&
            typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === "string"
          ) {
            errorMessage = (err as { response?: { data?: { message?: string } } }).response!.data!.message!;
          }

          toast({
            title: "Lỗi hệ thống",
            description: errorMessage,
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Đổi mật khẩu</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mật khẩu hiện tại */}
          <div>
            <label className="block text-sm font-medium mb-1">Mật khẩu hiện tại</label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrent((p) => !p)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mật khẩu mới */}
          <div>
            <label className="block text-sm font-medium mb-1">Mật khẩu mới</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew((p) => !p)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Xác nhận mật khẩu */}
          <div>
            <label className="block text-sm font-medium mb-1">Xác nhận mật khẩu</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="flex justify-end gap-2 pt-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg text-gray-700">
              Hủy
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Save className="w-4 h-4" /> {isPending ? "Đang xử lý..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
