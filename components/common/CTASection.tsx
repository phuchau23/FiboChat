"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { decodeToken } from "@/utils/jwt";
import { useChatbotHub } from "@/hooks/useChatbotHub";

export default function CTASection() {
  const router = useRouter();

  // Lấy userId từ token
  const token = getCookie("auth-token");
  const decoded = token ? decodeToken(token.toString()) : null;
  const userId = decoded?.nameid;

  // Kết nối SignalR Hub
  const { isConnected } = useChatbotHub(userId);

  // Chuyển trang sau khi hub sẵn sàng
  const handleStartChat = () => {
    if (!userId) {
      router.push("/login");
      return;
    }

    if (!isConnected) {
      console.log("Waiting for hub to connect...");
      return;
    }
    console.log("Hub ready → Redirecting to /chat");
    router.push("/chat");
  };

  return (
    <section className="relative overflow-hidden bg-[#0A1F44] py-20">
      {/* Decorative 3D shapes background */}
      <div className="absolute inset-0">
        <Image
          src="/CTA_img.jpg"
          alt=""
          width={1920}
          height={1080}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          {/* Heading */}
          <h2 className="mb-8 text-balance text-4xl font-bold text-white md:text-5xl ">
            Bắt đầu hành trình học tập cùng
            <br />
            <span className="text-orange-500 block mt-4">Fibo Edu</span>
          </h2>
          <p className="mb-8 text-gray-300 text-lg md:text-xl">
            Nền tảng học tập AI cá nhân hóa dành riêng cho sinh viên FPTU.
          </p>

          {/* CTA Button */}
          <Button
            onClick={handleStartChat}
            className="rounded-full bg-[#FF6B00] px-16 py-6 text-white font-semibold text-lg shadow-[0_5px_0_0_#E85D04] hover:translate-y-[1px] hover:shadow-[0_3px_0_0_#E85D04] active:translate-y-[2px] active:shadow-[0_2px_0_0_#E85D04] transition-all"
          >
            Bắt đầu hỏi đáp
          </Button>
        </div>
      </div>
    </section>
  );
}
