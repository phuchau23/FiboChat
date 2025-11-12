"use client";

import { Suspense, useState, useMemo } from "react";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

function ResetPasswordFormContent() {
  const { resetPassword, loading, error } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams]);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldError, setFieldError] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  const [success, setSuccess] = useState(false);

  const validatePassword = (password: string): string | null => {
    if (!password) return "Mật khẩu không được để trống";
    if (password.length < 8) return "Mật khẩu phải có ít nhất 8 ký tự";
    if (!/[A-Z]/.test(password))
      return "Mật khẩu phải có ít nhất 1 chữ cái viết hoa";
    if (!/[0-9]/.test(password)) return "Mật khẩu phải có ít nhất 1 chữ số";
    return null;
  };

  const validate = () => {
    const newErr: typeof fieldError = {};

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErr.password = passwordError;

    if (!formData.confirmPassword) {
      newErr.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.password !== formData.confirmPassword) {
      newErr.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    return newErr;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError({});

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldError(errs);
      return;
    }

    if (!token) {
      setFieldError({
        password: "Liên kết không hợp lệ hoặc đã hết hạn.",
      });
      return;
    }

    const ok = await resetPassword(
      token,
      formData.password,
      formData.confirmPassword
    );

    if (ok) {
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    }
  };

  const hasMinLength = formData.password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(formData.password);
  const hasNumber = /[0-9]/.test(formData.password);

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl text-center">
          <KeyRound className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Đặt lại mật khẩu thành công
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Bạn sẽ được chuyển đến trang đăng nhập trong giây lát...
          </p>
          <Button
            onClick={() => router.push("/login")}
            className="w-full bg-[#ff6b00] hover:bg-[#F87402] text-white font-semibold"
          >
            Quay lại đăng nhập
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center">
          <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-200">
            <KeyRound className="h-8 w-8 text-gray-700" />
          </div>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Reset password</h1>
          <p className="text-gray-600">Nhập mật khẩu mới của bạn bên dưới.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <Alert type="error" message={error} />}

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              New password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                disabled={loading}
                className="h-12 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="flex gap-2 mt-2">
              <div
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  hasMinLength ? "bg-green-500" : "bg-gray-200"
                }`}
              />
              <div
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  hasUpperCase ? "bg-green-500" : "bg-gray-200"
                }`}
              />
              <div
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  hasNumber ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            </div>

            {fieldError.password && (
              <p className="text-sm text-red-600">{fieldError.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-700"
            >
              Confirm password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                disabled={loading}
                className="h-12 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {fieldError.confirmPassword && (
              <p className="text-sm text-red-600">
                {fieldError.confirmPassword}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#ff6b00] hover:bg-[#F87402] text-white font-semibold text-base rounded-lg shadow-sm transition-colors"
          >
            {loading ? "Đang xử lý..." : "Xác nhận đổi mật khẩu"}
          </Button>

          <div className="text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

// Component wrap Suspense
export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center gap-4">
            <KeyRound className="h-12 w-12 text-gray-400 animate-pulse" />
            <p className="text-gray-600">Đang tải...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordFormContent />
    </Suspense>
  );
}
