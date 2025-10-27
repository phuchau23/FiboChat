"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "./components/Header";
import LecturerSidebar from "./components/LecturerSidebar";

// 🔹 Tạo QueryClient một lần
const queryClient = new QueryClient();

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen bg-[#fff7f1]">
        {/* Sidebar */}
        <LecturerSidebar />

        {/* Content area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <Header />

          {/* Main content */}
          <main className="flex-1 p-8 bg-white">{children}</main>
        </div>
      </div>
    </QueryClientProvider>
  );
}
