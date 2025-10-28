"use client";

import { cleanExpiredTokenOnLoad } from "@/utils/cookieConfig";
import { useEffect } from "react";

export default function AuthInitProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    cleanExpiredTokenOnLoad(); // Hàm này kiểm tra cookie 'auth-token' có hết hạn không
  }, []);

  return <>{children}</>;
}
