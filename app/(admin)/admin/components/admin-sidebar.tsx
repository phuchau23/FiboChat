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
} from "lucide-react";

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

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border h-screen sticky top-0 overflow-y-auto">
      <div className="flex items-center gap-2 p-6 border-b border-sidebar-border">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo_header.png"
            alt="Fibo Edu Logo"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
            priority
          />
          <div className="text-2xl font-bold ml-2">
            <span className="text-black dark:text-white">Fibo</span>{" "}
            <span className="text-orange-500">Edu</span>
          </div>
        </Link>
      </div>

      <nav className="space-y-2 px-4 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-200 ease-in-out",
                isActive
                  ? "bg-[#FF6B00] text-white"
                  : "text-sidebar-foreground hover:bg-[#FF6B00]/10"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 transition-colors duration-100",
                  isActive
                    ? "text-white"
                    : "text-gray-600 group-hover:text-[#FF6B00]"
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
