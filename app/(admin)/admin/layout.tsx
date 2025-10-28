"use client";

import type React from "react";
import { AdminSidebar } from "@/app/(admin)/admin/components/admin-sidebar";
import { AdminHeader } from "@/app/(admin)/admin/components/admin-header";
import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />

        {/* Main content area */}
        <QueryClientProvider client={queryClient}>
          <div className="flex-1 overflow-y-auto">
            <div className="p-8">{children}</div>
          </div>
          <Toaster />
        </QueryClientProvider>
      </main>

      <Toaster />
    </div>
  );
}
