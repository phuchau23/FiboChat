"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  Layers,
  Users,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Overview", href: "/admin/overview", icon: LayoutDashboard },
  { label: "Semester", href: "/admin/semester", icon: Calendar },
  { label: "Class", href: "/admin/class", icon: BookOpen },
  { label: "Topic", href: "/admin/topic", icon: Layers },
  { label: "Lecturer", href: "/admin/lecturer", icon: UserCheck },
  { label: "Student", href: "/admin/user", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Open Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-[90] bg-[#FF6B00] text-white p-2 rounded-lg shadow"
      >
        <Menu size={20} />
      </button>

      {/* Overlay khi mobile mở */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[80] md:hidden"
        />
      )}

      {/* SIDEBAR DESKTOP */}
      <aside
        className={cn(
          "group relative bg-gray-50 border-r border-sidebar-border h-screen sticky top-0 transition-all duration-300",
          "hidden md:block",
          collapsed ? "w-20" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 p-6 border-b border-gray-200 transition-all">
          <Image
            src="/logo_header.png"
            alt="Fibo Edu Logo"
            width={40}
            height={40}
            className="h-10 w-10 object-contain shrink-0"
          />
          {!collapsed && (
            <div className="text-2xl font-bold ml-2 whitespace-nowrap">
              <span className="text-black">Fibo</span>{" "}
              <span className="text-orange-500">Edu</span>
            </div>
          )}
        </div>

        {/* Menu */}
        <nav className="space-y-2 px-2 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-2 rounded-lg font-medium transition-all",
                  isActive
                    ? "bg-[#FF6B00] text-white"
                    : "text-gray-700 hover:bg-[#FF6B00]/10"
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "absolute top-14 right-0 translate-x-1/2 hidden md:flex",
            "w-7 h-7 rounded-full items-center justify-center shadow-md bg-[#FF6B00] text-white transition-all",
            "opacity-0 group-hover:opacity-100"
          )}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </aside>

      {/* SIDEBAR MOBILE (Drawer) */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen w-64 bg-gray-50 border-r border-gray-200 z-[100] transition-transform duration-300 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="text-2xl font-bold">
            <span className="text-black">Fibo</span>{" "}
            <span className="text-orange-500">Edu</span>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="text-gray-700"
          >
            ✕
          </button>
        </div>

        <nav className="space-y-2 px-3 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)} // Tự động đóng khi chọn menu
                className={cn(
                  "flex items-center px-4 py-2 rounded-lg font-medium transition-all",
                  isActive
                    ? "bg-[#FF6B00] text-white"
                    : "text-gray-700 hover:bg-[#FF6B00]/10"
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="ml-3">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
