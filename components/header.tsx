import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center ">
          <Image
            src="/logo_header.png"
            alt="Fibo Edu Logo"
            width={100}
            height={40}
            className="h-8 w-auto"
            priority
          />
          <div className="text-2xl font-bold">
            {" "}
            <span className="text-black">Fibo</span>{" "}
            <span className="text-orange-500">Edu</span>{" "}
          </div>
        </Link>

        {/* login Button */}
        <Button
          className="border-2 border-gray-300 text-black text-lg px-4 leading-none font-semibold rounded-full hover:bg-gray-100 transition"
          variant="outline"
        >
          Đăng nhập
        </Button>
      </div>
    </header>
  );
}
