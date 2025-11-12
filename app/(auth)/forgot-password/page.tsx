"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Alert } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Vui lòng cung cấp một địa chỉ email vào ô bên dưới");
      return;
    }

    const ok = await forgotPassword(email);
    if (ok) setSuccess(true);
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-10 shadow-xl text-center">
          {/* Mailbox image */}
          <div className="flex justify-center mb-6">
            <Image
              src="/img_email.png" // sample mailbox icon
              alt="Mailbox"
              width={120}
              height={120}
              className="mx-auto"
            />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Kiểm tra hộp thư của bạn
          </h2>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-8">
            Chúng tôi đã gửi hướng dẫn khôi phục mật khẩu đến{" "}
            <span className="text-[#ff6b00] font-medium">{email}</span>
          </p>

          {/* Open Gmail Button */}
          <a
            href="https://mail.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 hover:bg-gray-100 transition"
          >
            <Image src="/gmail.png" alt="Gmail icon" width={20} height={20} />
            <span className="text-sm font-medium text-gray-800">Mở Gmail</span>
          </a>

          <Button
            className="mt-3 gap-2 bg-transparent text-gray-600 hover:text-gray-700 text-xs shadow-none border-none hover:bg-transparent"
            onClick={() => setSuccess(false)}
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
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

          <form onSubmit={handleSubmit} className={` ${error ? "mt-4" : ""}`}>
            <div className="relative">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-6 bg-[#ff6b00] text-white border-b-4 border-[#E85D04] hover:bg-[#F87402] shadow-[0_0.1px_0_0_#E85D04] hover:translate-y-[1px] hover:shadow-[0_0.05px_0_0_#E85D04] active:translate-y-[2px] active:shadow-[0_2px_0_0_#E85D04] transition-all"
            >
              Đặt lại mật khẩu
            </Button>
            <Button
              type="button"
              className="mt-3 gap-2 bg-transparent text-gray-600 hover:text-gray-700 text-xs shadow-none border-none hover:bg-transparent"
              onClick={() => router.push("/login")}
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại trang đăng nhập
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
