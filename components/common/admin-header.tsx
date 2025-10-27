"use client";

import { Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { ThemeToggle } from "@/components/theme-toggle";
// import { LanguageSelector } from "@/components/language-selector";
import { useRouter } from "next/navigation";

export function AdminHeader() {
  const router = useRouter();

  const handleBellClick = () => {
    console.log("Notification bell clicked");
    // TODO: Implement notification panel
  };

  const handleLogout = () => {
    console.log("Logout clicked");
    // TODO: Implement logout logic
    // router.push("/login")
  };

  return (
    <header className="border-b border-border bg-background">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Left side - empty for future use */}
        <div />

        {/* Right side - 5 icons in order */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* 1. Language Selector */}
          {/* <LanguageSelector /> */}

          {/* 2. Theme Toggle */}
          {/* <ThemeToggle /> */}

          {/* 3. Notification Bell */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBellClick}
            className="w-9 h-9 relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            <span className="sr-only">Notifications</span>
          </Button>

          {/* 4. Logout */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="w-9 h-9"
          >
            <LogOut className="w-5 h-5" />
            <span className="sr-only">Logout</span>
          </Button>

          {/* 5. User Avatar */}
          <Avatar className="w-9 h-9 cursor-pointer">
            <AvatarImage
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
              alt="User avatar"
            />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
