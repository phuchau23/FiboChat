"use client";

import { cn } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, FileText, Star, BarChart3, School, ChevronLeft, ChevronRight, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

interface LecturerSidebarProps {
  onSectionChange?: (section: string) => void;
}

const menuItems = [
  { id: "overview", label: "Dashboard Overview", icon: BarChart3, href: "/lecturer/overview" },
  { id: "topic", label: "Topic", icon: BookOpen, href: "/lecturer/topic" },
  { id: "class", label: "Class", icon: Users, href: "/lecturer/class" },
  { id: "course", label: "Course Document", icon: FileText, href: "/lecturer/course" },
  { id: "feedback", label: "Feedback", icon: Star, href: "/lecturer/feedback" },
];

export default function LecturerSidebar({ onSectionChange }: LecturerSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Nút mở sidebar trên mobile */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-[90] bg-[#FF6B00] text-white p-2 rounded-lg shadow"
      >
        <Menu size={20} />
      </button>

      {/* Overlay cho mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[80] md:hidden"
        />
      )}

      {/* SIDEBAR DESKTOP */}
      <aside
        className={cn(
          "group relative bg-white border-r border-gray-200 h-screen sticky top-0 transition-all duration-300",
          "hidden md:flex flex-col",
          collapsed ? "w-24" : "w-64"
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center gap-3">
          <Image
            src="/logo_header.png"
            alt="Fibo Edu Logo"
            width={40}
            height={40}
            className="h-10 w-10 object-contain shrink-0 cursor-pointer"
            priority
          />
          {!collapsed && (
            <div className="text-2xl font-bold">
              <span className="text-black">Fibo</span> <span className="text-orange-500">Edu</span>
              <p className="text-sm text-gray-500 -mt-1">Lecturer Portal</p>
            </div>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.id} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-11 rounded-lg transition-all",
                    isActive ? "bg-orange-500 text-white hover:bg-orange-500/90" : "text-gray-700 hover:bg-orange-100",
                    collapsed && "justify-center px-0"
                  )}
                  onClick={() => onSectionChange?.(item.id)}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {!collapsed && item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg bg-orange-50 transition-all",
              collapsed && "justify-center"
            )}
          >
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <School className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">Fibo Edu</p>
                <p className="text-xs text-gray-500 truncate">SWP392 Chatbot</p>
              </div>
            )}
          </div>
        </div>

        {/* Nút thu gọn / mở rộng */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "absolute top-16 right-0 translate-x-1/2 hidden md:flex",
            "w-7 h-7 rounded-full items-center justify-center shadow-md bg-[#FF6B00] text-white transition-all",
            "opacity-0 group-hover:opacity-100"
          )}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </aside>

      {/* SIDEBAR MOBILE */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 z-[100] transition-transform duration-300 md:hidden flex flex-col",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="text-2xl font-bold">
            <span className="text-black">Fibo</span> <span className="text-orange-500">Edu</span>
          </div>
          <button onClick={() => setMobileOpen(false)} className="text-gray-700">
            ✕
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.id} href={item.href} onClick={() => setMobileOpen(false)}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-11 rounded-lg",
                    isActive ? "bg-orange-500 text-white hover:bg-orange-500/90" : "text-gray-700 hover:bg-orange-100"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
