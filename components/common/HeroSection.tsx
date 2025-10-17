import { Button } from "@/components/ui/button";
import { Star, Users, Award } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col justify-between items-center bg-white text-center">
      {/* Content phần trên */}
      <div className="flex flex-col items-center justify-center flex-grow">
        {/* Hero video */}
        <div className="mb-10 w-full max-w-3xl px-4">
          <video
            src="/learn-by-doing.webm"
            autoPlay
            loop
            muted
            playsInline
            className="mx-auto w-full h-auto object-contain"
          />
        </div>

        {/* Subtitle */}
        <p className="mb-8 px-4 text-gray-800 text-base md:text-xl font-medium">
          Giải pháp AI tương tác giúp sinh viên{" "}
          <span className="font-semibold">FPTU</span> học tập thông minh,
          <br className="hidden sm:block" />
          phát triển toàn diện.
        </p>

        {/* CTA Button */}
        <Button className="flex items-center justify-center gap-2 rounded-full bg-[#FF6B00] px-16 py-6 text-white font-semibold text-lg shadow-[0_5px_0_0_#E85D04] hover:translate-y-[1px] hover:shadow-[0_3px_0_0_#E85D04] active:translate-y-[2px] active:shadow-[0_2px_0_0_#E85D04] transition-all">
          Bắt đầu hỏi đáp
        </Button>
      </div>

      {/* Stats */}
      <div className=" py-4 border border-gray-200 w-full flex flex-col items-center justify-center gap-6 md:flex-row md:gap-36">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-orange-500" />
          <span className="text-md text-black">
            5,000+ sinh viên FPTU sử dụng
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Star className="h-6 w-6 text-orange-500" />
          <span className="text-md text-black">
            4.8/5 đánh giá từ sinh viên
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Award className="h-6 w-6 text-orange-500" />
          <span className="text-md text-black">
            Được giảng viên khuyến dùng
          </span>
        </div>
      </div>
    </section>
  );
}
