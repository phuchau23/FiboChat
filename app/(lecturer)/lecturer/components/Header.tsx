"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, LogOut, Globe, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthContext } from "@/lib/providers/authProvider";
import { useTheme } from "next-themes";
import GlareHover from "@/components/effects/GlareHover";

export default function Header() {
  const { user, logout } = useAuthContext();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleBellClick = () => {
    console.log("Notification bell clicked");
  };

  const handleLogoutClick = () => {
    logout();
    router.push("/");
  };

  if (!mounted || !user) return null;

  return (
    <header className="border-b border-border bg-background">
      <div className="flex items-center justify-end px-8 py-4 gap-2 md:gap-3">
        <GlareHover
          width="auto"
          height="auto"
          background="transparent"
          borderColor="transparent"
          glareColor="#ffffff"
          glareOpacity={0.28}
          glareSize={420}
          glareAngle={-25}
          transitionDuration={1350}
          className="rounded-full backdrop-blur-sm bg-white/5"
        ></GlareHover>
        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="h-9 w-9 flex items-center justify-center rounded-full bg-gray-700 text-white text-sm font-semibold uppercase cursor-pointer hover:opacity-90 transition">
              {user.firstname[0]}
              {user.lastname[0]}
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-72 rounded-xl p-3 bg-white shadow-2xl border border-gray-200 z-[9999]"
          >
            {/* Header user info */}
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-700 text-white text-sm font-semibold uppercase">
                {user.firstname[0]}
                {user.lastname[0]}
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm text-gray-900">
                  {user.firstname} {user.lastname}
                </span>
                <span className="text-xs text-gray-500">{user.email}</span>
              </div>
            </div>

            <DropdownMenuItem
              onClick={handleLogoutClick}
              className="cursor-pointer flex items-center gap-2 py-2  hover:bg-gray-200 rounded-md font-medium transition"
            >
              <LogOut className="w-4 h-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
