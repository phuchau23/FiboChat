import { BookOpen, Users, FileText } from "lucide-react";
import Image from "next/image";

export default function FeaturesSection() {
  const features = [
    {
      icon: BookOpen,
      title: "Miễn phí, vui nhộn, hiệu quả",
      description:
        "Công cụ AI mang đến kiến thức, đồng thời hỗ trợ sinh viên miễn phí trong giúp sinh viên học tập, giải đáp mọi thắc mắc về môn học SWP392 qua Fibo Edu, cả trong và ngoài lớp học.",
      image: "/feature_img_1.png",
    },
    {
      icon: Users,
      title: "Tư vấn học tập",
      description:
        "Nhận lời khuyến và phương pháp học tập hiệu quả, lựa chọn môn học và chuẩn bị kỹ thi đại học một cách khoa học",
      image: "/feature_img_2.png",
    },
    {
      icon: FileText,
      title: "Cá nhân hóa trải nghiệm học",
      description:
        "Kết hợp những điểm mạnh nhất của trí tuệ nhân tạo (AI) và xây dựng lộ trình học tập cá nhân hóa để giúp bạn tìm được cấp độ và nhịp độ học phù hợp nhất.",
      image: "/feature_img_3.png",
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4 flex items-center justify-center ">
        <div className="space-y-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-col items-center gap-12 ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              }`}
            >
              {/* Text Content */}
              <div className="flex-[0.5]">
                <div className="space-y-4 max-w-[42ch] sm:max-w-[50ch] lg:max-w-[55ch]">
                  <h3 className="text-balance text-3xl font-bold text-orange-500 md:text-4xl leading-tight">
                    {feature.title}
                  </h3>
                  <p className="font-medium text-md leading-relaxed text-gray-700">
                    {feature.description}
                  </p>
                </div>
              </div>

              {/* Image */}
              <div className="flex-[0.5]">
                <Image
                  src={feature.image || "/placeholder.svg"}
                  alt={feature.title}
                  className="object-contain w-full h-auto mx-auto max-w-md"
                  width={500}
                  height={500}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
