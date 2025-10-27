"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/lib/providers/authProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, Settings } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const { user, logout, loading } = useAuthContext();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 0);
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
          <div className="text-2xl font-bold ml-2">
            <span className="text-black">Fibo</span>{" "}
            <span className="text-orange-500">Edu</span>
          </div>
        </Link>

        {/* Right Section */}
        {loading ? (
          <div className="animate-pulse h-4 w-24 bg-gray-200 rounded" />
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 cursor-pointer rounded-full hover:bg-gray-100 px-2 py-1 transition">
                <div className="h-9 w-9 flex items-center justify-center rounded-full bg-gray-700 text-white text-sm font-semibold uppercase">
                  {user.firstname[0]}
                  {user.lastname[0]}
                </div>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-60 rounded-xl shadow-lg p-2"
            >
              {/* User info header */}
              <div className="flex items-center gap-3 px-2 py-2">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-700 text-white font-semibold uppercase">
                  {user.firstname[0]}
                  {user.lastname[0]}
                </div>
                <div className="flex flex-col">
                  <p className="font-medium text-sm text-gray-900">
                    {user.firstname} {user.lastname}
                  </p>
                  <p className="text-xs text-gray-500 truncate max-w-[160px]">
                    {user.email}
                  </p>
                </div>
              </div>

              <DropdownMenuSeparator />

              {/* Manage account */}
              <DropdownMenuItem
                onClick={() => router.push("/profile")}
                className="cursor-pointer flex items-center gap-2 px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <Settings size={16} className="text-gray-500" />
                Quản lí tài khoản
              </DropdownMenuItem>

              {/* Sign out */}
              <DropdownMenuItem
                onClick={logout}
                className="cursor-pointer flex items-center gap-2 px-2 py-2 text-sm  hover:bg-red-50 rounded-md"
              >
                <LogOut size={16} />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="outline"
            onClick={() => router.push("/login")}
            className="border-2 border-gray-300 text-black text-lg px-6 font-semibold rounded-full hover:bg-gray-100 transition"
          >
            Đăng nhập
          </Button>
        )}
      </div>
    </header>
  );
}
