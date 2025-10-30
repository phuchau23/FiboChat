"use client";

import { cn } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, FileText, Star, Tag, MessageSquare, BarChart3, School } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

interface LecturerSidebarProps {
  onSectionChange?: (section: string) => void;
}

const menuItems = [
  { id: "overview", label: "Dashboard Overview", icon: BarChart3, href: "/lecturer" },
  { id: "topic", label: "Topic", icon: BookOpen, href: "/lecturer/topic" },
  { id: "class", label: "Class", icon: Users, href: "/lecturer/class" },
  { id: "course", label: "Course Document", icon: FileText, href: "/lecturer/course" },
  { id: "report", label: "Report", icon: FileText, href: "/lecturer/report" },
  { id: "feedback", label: "Feedback", icon: Star, href: "/lecturer/feedback" },
  { id: "tag", label: "Tag", icon: Tag, href: "/lecturer/tag" },
  { id: "chatbox", label: "ChatBox", icon: MessageSquare, href: "/lecturer/chatbox" },
];

export default function LecturerSidebar({ onSectionChange }: LecturerSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo_header.png"
            alt="Fibo Edu Logo"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
            priority
          />
          <div className="text-2xl font-bold ml-2">
            <span className="text-black dark:text-white">Fibo</span> <span className="text-orange-500">Edu</span>
            <p className="text-sm text-gray-500">Lecturer Portal</p>
          </div>
        </Link>
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
                  "w-full justify-start gap-3 h-11 rounded-lg",
                  isActive ? "bg-orange-500 text-white hover:bg-orange-500/90" : "text-gray-700 hover:bg-orange-100"
                )}
                onClick={() => onSectionChange?.(item.id)}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-50">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <School className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800">Fibo Edu</p>
            <p className="text-xs text-gray-500 truncate">SWP392 Chatbot</p>
          </div>
        </div>
      </div>
    </div>
  );
}
