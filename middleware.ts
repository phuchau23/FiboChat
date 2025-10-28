import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const authRoutes = ["/login", "/forgot-password", "/change-password"];

const getUserRole = (token?: string): string | null => {
  if (!token) return null;
  try {
    const decoded = jwt.decode(token) as { role?: string } | null;
    return decoded?.role ?? null;
  } catch {
    console.error("[AUTH] Failed to decode token");
    return null;
  }
};

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("auth-token")?.value;
  const role = getUserRole(token);

  // ✅ 1. Nếu chưa login, cho vào tất cả route public + trang "/"
  if (!token) {
    return NextResponse.next();
  }

  // ✅ 2. Nếu user đã login mà vào /login,... → redirect theo vai trò
  if (authRoutes.includes(pathname)) {
    switch (role) {
      case "Admin":
        return NextResponse.redirect(new URL("/admin", req.url));
      case "Lecturer":
        return NextResponse.redirect(new URL("/lecturer", req.url));
      default:
        return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // ✅ 3. Giới hạn quyền truy cập
  if (pathname.startsWith("/admin") && role !== "Admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname.startsWith("/lecturer") && role !== "Lecturer") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // ✅ 4. Nếu user vào root "/" → KHÔNG redirect đi đâu cả
  if (pathname === "/") {
    return NextResponse.next();
  }

  // ✅ 5. Nếu Admin hoặc Lecturer vào ngoài khu vực → redirect về trang chính của họ
  if (role === "Admin" && !(pathname === "/admin" || pathname.startsWith("/admin"))) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  if (role === "Lecturer" && !(pathname === "/lecturer" || pathname.startsWith("/lecturer"))) {
    return NextResponse.redirect(new URL("/lecturer", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|ico|webp|mp4|webm|ogg|mp3|wav|mov)$).*)",
  ],
};
