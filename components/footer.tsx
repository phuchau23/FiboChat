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
    <footer className="bg-black py-12 text-white">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Logo and Brand */}
          <div>
            <div className="mb-4 text-2xl font-bold">
              <span className="text-orange-500">Fibo</span>{" "}
              <span className="text-orange-500">Edu</span>
            </div>
          </div>

          {/* Footer Links */}
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

        {/* Copyright */}
        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-xs text-gray-500">
          © 2025 Fibo Edu, Inc. Phần Mềm và Logo Fibo Edu là Nhãn Hiệu Thương
          Mại của Fibo Edu, Inc.
        </div>
      </div>
    </footer>
  );
}
