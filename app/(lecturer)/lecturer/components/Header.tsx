"use client";

import { useRouter } from "next/navigation";
import { Globe, Moon, Bell, LogOut } from "lucide-react";

export default function Header() {
  const router = useRouter();

  const handleProfileClick = () => {
    router.push("/lecturer/profile");
  };

  return (
    <header className="flex items-center justify-end gap-4 p-4 bg-white shadow">
      <Globe className="w-5 h-5 cursor-pointer" />
      <Moon className="w-5 h-5 cursor-pointer" />
      <Bell className="w-5 h-5 text-red-500 cursor-pointer" />
      <LogOut className="w-5 h-5 cursor-pointer" />

      {/* Avatar chuyển hướng đến trang profile */}
      <img
        src="/admin_avatar.png"
        alt="avatar"
        onClick={handleProfileClick}
        className="w-8 h-8 rounded-full cursor-pointer hover:ring-2 hover:ring-orange-500 transition"
      />
    </header>
  );
}
