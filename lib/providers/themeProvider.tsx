"use client";

import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";
import { useState, useEffect } from "react";

/**
 * ThemeProvider tuỳ chỉnh để:
 * - Tránh lỗi hydration (SSR khác Client)
 * - Cho phép dùng dark/light mode linh hoạt
 * - Giúp gói gọn logic next-themes trong 1 nơi
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  //  Chỉ render sau khi client đã mount
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Tránh lỗi mismatch giữa SSR và client
    return <>{children}</>;
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
