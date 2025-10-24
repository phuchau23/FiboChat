"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { Alert } from "@/components/ui/alert";
import { motion } from "framer-motion";
import Link from "next/link";
import { Label } from "@radix-ui/react-label";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Vui lòng cung cấp một địa chỉ email vào ô bên dưới");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        "http://103.211.201.89:5001/api/user/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (!res.ok) throw new Error("Không thể gửi email đặt lại mật khẩu");

      // ✅ Hiển thị giao diện xác nhận
      setSuccess(true);
    } catch (err) {
      setError("Có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // ⬇️ Giao diện sau khi gửi thành công
  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl text-center relative">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Kiểm tra hộp thư đến của bạn
          </h2>
          <p className="text-gray-600 text-sm mb-14 text-left leading-normal">
            Chúng tôi đã gửi cho bạn một liên kết đăng nhập tới {email}. Liên
            kết này sẽ hết hạn trong thời gian ngắn.
          </p>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full h-12 border border-[#ff6b00] bg-white text-[#ff6b00] font-semibold hover:bg-[#ff6b00] hover:text-white"
          >
            Gửi lại email
          </Button>

          <p className="text-sm text-gray-600 mt-4 text-left leading-normal">
            Bạn không tìm thấy liên kết? Kiểm tra mục thư rác trong hộp thư của
            bạn.
          </p>

          <div className="mt-5">
            <Link
              href="/login"
              className="flex items-center text-sm text-[#ff6b00] hover:underline"
            >
              <ArrowLeft className="mr-1 h-4 w-4" /> Quay lại trang Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="grid w-full max-w-5xl grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Side Image */}
        <div className="relative hidden md:block">
          <Image
            src="/change_password.png"
            alt="Forgot Password Illustration"
            width={500}
            height={500}
            className="object-cover"
          />
        </div>

        {/* Right Side Form */}
        <div className="flex flex-col justify-center px-8 py-10 md:px-14 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Quên mật khẩu
          </h2>
          <p className="text-gray-600 text-sm mb-1">
            Vui lòng nhập địa chỉ email bạn sử dụng trên Fibo Edu.
          </p>
          <p className="text-gray-600 text-sm mb-6">
            Chúng tôi sẽ gửi một liên kết để bạn đặt lại mật khẩu.
          </p>

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
            <div className="relative">
              <Input
                type="email"
                placeholder="name@fpt.edu.vn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#ff6b00] text-white border-b-4 border-[#E85D04] hover:bg-[#F87402] shadow-[0_0.1px_0_0_#E85D04] hover:translate-y-[1px] hover:shadow-[0_0.05px_0_0_#E85D04] active:translate-y-[2px] active:shadow-[0_2px_0_0_#E85D04] transition-all"
            >
              Đặt lại mật khẩu
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
