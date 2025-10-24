"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const { login, loading, error } = useAuth();

  const [formData, setFormData] = useState({ Email: "", Password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldError, setFieldError] = useState<{
    Email?: string;
    Password?: string;
  }>({});

  const validate = () => {
    const newErr: typeof fieldError = {};
    if (!formData.Email) newErr.Email = "Email không được để trống";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email))
      newErr.Email = "Email không hợp lệ";
    if (!formData.Password) newErr.Password = "Mật khẩu không được để trống";
    else if (formData.Password.length < 6)
      newErr.Password = "Mật khẩu tối thiểu 6 ký tự";
    return newErr;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError({});
    const errs = validate();
    if (Object.keys(errs).length > 0) return setFieldError(errs);

    await login(formData.Email, formData.Password);
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* LEFT SECTION */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-[#FF7A1A] text-white relative overflow-hidden px-10 m-2 rounded-3xl">
        <Image src="/img_bg.png" alt="Illustration" width={500} height={400} />
        <div className="mt-10 text-center space-y-3">
          <h2 className="text-2xl font-semibold">
            New Scheduling And Routing Options
          </h2>
          <p className="text-sm text-blue-100 max-w-sm mx-auto">
            We also updated the format of podcasts and rewards.
          </p>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex w-full lg:w-1/2 justify-center items-center bg-white px-8 md:px-16">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <Image
              src="/logo_login.png"
              alt="Logo"
              width={200}
              height={200}
              className="mx-auto"
            />
            <h1 className="text-2xl font-bold text-gray-900">Đăng nhập</h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {(fieldError.Email || fieldError.Password || error) && (
              <Alert
                type="error"
                message={
                  error ||
                  fieldError.Email ||
                  fieldError.Password ||
                  "Đã xảy ra lỗi, vui lòng thử lại."
                }
              />
            )}

            {/* Email */}
            <div>
              <Label htmlFor="email" className="sr-only">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={formData.Email}
                onChange={(e) =>
                  setFormData({ ...formData, Email: e.target.value })
                }
                disabled={loading}
                className="h-11 border-gray-300"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                value={formData.Password}
                onChange={(e) =>
                  setFormData({ ...formData, Password: e.target.value })
                }
                disabled={loading}
                className="h-11 pr-10 border-gray-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

              <div className="mt-2 text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm text-black hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-11 bg-[#FF6B00] text-white font-semibold text-lg border-b-4 border-[#E85D04] hover:bg-[#F87402]"
            >
              Đăng nhập
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500">HOẶC</span>
              </div>
            </div>

            {/* Google Login */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 flex items-center justify-center gap-2 border-2 border-[#e5e5e5] bg-white text-gray-700 transition-colors hover:bg-gray-50 border-b-4"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Đăng nhập với Google
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
