import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/providers/authProvider";
import { QueryProvider } from "@/lib/providers/queryProviders";
import AuthInitProvider from "@/lib/providers/authInitProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "FiboEdu - Nền Tảng AI Hỗ Trợ Học Tập",
  description: "Nền tảng học tập thông minh dành cho sinh viên FPTU",
  icons: {
    icon: "/logo_header.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-gray-50`}
      >
        <QueryProvider>
          <AuthInitProvider>
            <AuthProvider>{children}</AuthProvider>
          </AuthInitProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
