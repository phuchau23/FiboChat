"use client";

import { cn } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Users,
  BookOpen,
  UsersRound,
  FileText,
  Settings,
  BarChart3,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminSidebarProps {
  onSectionChange: (section: string) => void;
}

const menuItems = [
  {
    id: "overview",
    label: "Dashboard Overview",
    icon: BarChart3,
    href: "/admin",
  },
  {
    id: "lecture",
    label: "Lecture Management",
    icon: Users,
    href: "/admin/lecture",
  },
  {
    id: "course",
    label: "Course Management",
    icon: BookOpen,
    href: "/admin/course",
  },
  {
    id: "student",
    label: "Student Groups",
    icon: UsersRound,
    href: "/admin/student",
  },
  {
    id: "report",
    label: "Reports & Analytics",
    icon: FileText,
    href: "/admin/report",
  },
  {
    id: "settings",
    label: "System Settings",
    icon: Settings,
    href: "/admin/settings",
  },
];

export default function AdminSidebar({ onSectionChange }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-sidebar-foreground">
              FPT University
            </h1>
            <p className="text-sm text-muted-foreground">
              SWP392 Admin Chatbot
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.id} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-11",
                  isActive
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
                onClick={() => onSectionChange(item.id)}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-sidebar-accent">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground">
              FPT University
            </p>
            <p className="text-xs text-muted-foreground truncate">
              Software Engineering Dept.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
