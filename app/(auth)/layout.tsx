import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FiboEdu - Đăng nhập",
  icons: {
    icon: "/logo_header.png",
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
