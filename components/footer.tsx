import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const footerLinks = {
    "Tính năng": [
      "Trợ lý học tập",
      "Cá nhân hóa trải nghiệm học",
      "Học tập nhóm phối",
    ],
    "Về chúng tôi": ["Trang chủ", "Giới thiệu", "Liên hệ"],
    "Liên hệ": ["Hỏi & đáp Fibo Edu", "Trung tâm trợ giúp", "Tuyển thông"],
  };

  return (
    <footer className="bg-black py-4 text-white">
      <div className="flex max-w-5xl mx-auto px-4 pb-16 pt-12">
        {/* Logo riêng */}
        <div>
          <Link href="/" className="flex items-center">
            <Image
              src="/logo_header.png"
              alt="Fibo Edu Logo"
              width={100}
              height={40}
              className="h-8 w-auto"
              priority
            />
            <div className="ml-2 text-2xl font-bold">
              <span className="text-white">Fibo</span>{" "}
              <span className="text-[#ff6b00]">Edu</span>
            </div>
          </Link>
        </div>

        {/* Footer Links */}
        <div className="flex gap-x-12 ml-52">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="mb-4 font-semibold">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm text-gray-400 transition-colors hover:text-orange-500"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* --- Copyright --- */}
      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © 2025 Fibo Edu, Inc. Phần Mềm và Logo Fibo Edu là Nhãn Hiệu Thương Mại
        của Fibo Edu, Inc.
      </div>
    </footer>
  );
}
