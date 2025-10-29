"use client";

import dynamic from "next/dynamic";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";

const ProfileInfo = dynamic(() => import("./components/ProfileInfo"), { ssr: false });

const queryClient = new QueryClient();

export default function ProfilePage() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen bg-[#fff7f1]">
        {/* Header */}
        <Header />

        {/* Nội dung chính */}
        <main className="flex-1 pb-10">
          <ProfileInfo />
        </main>

        {/* Footer */}
        <Footer />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}
