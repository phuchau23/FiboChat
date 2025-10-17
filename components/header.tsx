"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "border-b border-gray-200 bg-white shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo_header.png"
            alt="Fibo Edu Logo"
            width={100}
            height={40}
            className="h-8 w-auto"
            priority
          />
          <div className="text-2xl font-bold">
            <span className="text-black">Fibo</span>{" "}
            <span className="text-orange-500">Edu</span>
          </div>
        </Link>

        {/* Login Button */}
        <Button
          className="border-2 border-gray-300 text-black text-lg px-6 font-semibold rounded-full hover:bg-gray-100 transition"
          variant="outline"
          onClick={() => router.push("/login")}
        >
          Đăng nhập
        </Button>
      </div>
    </header>
  );
}
