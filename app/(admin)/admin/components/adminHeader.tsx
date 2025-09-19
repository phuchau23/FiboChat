"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Bell, User, LogOut, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminHeader() {
  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search teachers, courses, students..."
            className="pl-10 bg-background border border-gray-300 rounded-md focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full text-xs flex items-center justify-center text-destructive-foreground">
            3
          </span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full p-0 overflow-hidden"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src="/admin-avatar.png" alt="Admin" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-56 bg-card border border-gray-200 rounded-lg shadow-lg p-2 z-50"
            align="end"
            forceMount
          >
            <DropdownMenuLabel className="font-normal p-2">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold leading-none">Admin User</p>
                <p className="text-xs leading-none text-muted-foreground">
                  admin@fe.edu.vn
                </p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="my-1 border-gray-200" />

            <DropdownMenuItem className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-gray-100">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-gray-100">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1 border-gray-200" />

            <DropdownMenuItem className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-gray-100">
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
