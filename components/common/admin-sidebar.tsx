"use client";

import Link from "next/link";
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
      <div className="p-6">
        <h1 className="text-2xl font-bold text-sidebar-foreground">Admin</h1>
        <p className="text-sm text-sidebar-foreground/60">Dashboard</p>
      </div>

      <nav className="space-y-2 px-4">
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
                  ? "bg-[#FF6B00] text-white "
                  : "text-sidebar-foreground hover:bg-[#FF6B00]/10 "
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
