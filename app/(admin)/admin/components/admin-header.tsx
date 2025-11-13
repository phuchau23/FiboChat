"use client";

import { LogOut, Globe, Moon, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthContext } from "@/lib/providers/authProvider";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import GlareHover from "@/components/effects/GlareHover";

export function AdminHeader() {
  const { user, logout } = useAuthContext();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!mounted || !user) return null;

  return (
    <header className="border-b border-border bg-background">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-2 text-xl font-medium text-slate-700">
          Welcome back,
          <span className="font-semibold text-slate-900 text-xl">
            {user.firstname} {user.lastname}
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 md:gap-3 mr-4">
          {/* User Dropdown */}
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
          >
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

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                  className="cursor-pointer flex items-center gap-2 py-2 text-gray-700 hover:bg-gray-200 rounded-md transition"
                >
                  {theme === "light" ? (
                    <>
                      <Moon className="w-4 h-4" /> Dark Mode
                    </>
                  ) : (
                    <>
                      <Sun className="w-4 h-4" /> Light Mode
                    </>
                  )}
                </DropdownMenuItem>

                <DropdownMenuItem className="cursor-pointer flex items-center gap-2 py-2 text-gray-700 hover:bg-gray-200 rounded-md transition">
                  <Globe className="w-4 h-4" /> Language
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Logout */}
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer flex items-center gap-2 py-2  hover:bg-gray-200 rounded-md font-medium transition"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </GlareHover>
        </div>
      </div>
    </header>
  );
}
