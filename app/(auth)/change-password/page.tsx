"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { Alert } from "@/components/ui/alert";
import { motion } from "framer-motion";

export default function ChangePasswordPage() {
  const { changePasswordFirstTime, loading } = useAuth();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Validate logic (giống Reset Password)
  const validatePassword = (password: string): string | null => {
    if (!password) return "Mật khẩu không được để trống";
    if (password.length < 8) return "Mật khẩu phải có ít nhất 8 ký tự";
    if (!/[A-Z]/.test(password))
      return "Mật khẩu phải có ít nhất 1 chữ cái viết hoa";
    if (!/[0-9]/.test(password)) return "Mật khẩu phải có ít nhất 1 chữ số";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const errMsg = validatePassword(newPassword);
    if (errMsg) {
      setError(errMsg);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    await changePasswordFirstTime(newPassword, confirmPassword);
  };

  // ✅ Indicator logic
  const hasMinLength = newPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="grid w-full max-w-5xl grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Side Image */}
        <div className="relative hidden md:block">
          <Image
            src="/change_password.png"
            alt="Change Password Illustration"
            width={500}
            height={500}
            className="object-cover"
          />
        </div>

        {/* Right Side Form */}
        <div className="flex flex-col justify-center px-8 py-10 md:px-14">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Change Password
          </h2>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Alert type="error" message={error} />
            </motion.div>
          )}
          <form
            onSubmit={handleSubmit}
            className={`space-y-6 ${error ? "mt-4" : ""}`}
          >
            {/* New Password */}
            <div>
              <Label htmlFor="newPassword" className="text-sm font-medium">
                New Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="newPassword"
                  type={showNew ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pr-10"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowNew((prev) => !prev)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* ✅ Indicators (from Reset Password) */}
              <div className="flex gap-2 mt-2">
                <div
                  className={`h-1.5 flex-1 rounded-full ${
                    hasMinLength ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
                <div
                  className={`h-1.5 flex-1 rounded-full ${
                    hasUpperCase ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
                <div
                  className={`h-1.5 flex-1 rounded-full ${
                    hasNumber ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm New Password
              </Label>

              <div className="relative mt-1">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((prev) => !prev)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-[#ff6b00] text-white border-b-4 border-[#E85D04] hover:bg-[#F87402] shadow-[0_0.1px_0_0_#E85D04] hover:translate-y-[1px] hover:shadow-[0_0.05px_0_0_#E85D04] active:translate-y-[2px] active:shadow-[0_2px_0_0_#E85D04] transition-all"
              >
                {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
