import { NextRequest, NextResponse } from "next/server";
import { decodeToken } from "@/utils/jwt";

const authRoutes = ["/login", "/forgot-password", "/change-password"];

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("auth-token")?.value;
  const role = token ? decodeToken(token)?.role ?? null : null;

  // Nếu chưa đăng nhập → cho vào route public
  if (!token) {
    if (pathname.startsWith("/admin") || pathname.startsWith("/lecturer")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }



  // Nếu đã login mà vào /login, /forgot-password,... → redirect theo vai trò
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

  // Giới hạn quyền truy cập
  if (pathname.startsWith("/admin") && role !== "Admin")
    return NextResponse.redirect(new URL("/", req.url));

  if (pathname.startsWith("/lecturer") && role !== "Lecturer")
    return NextResponse.redirect(new URL("/", req.url));

  // Giữ nguyên root
  if (pathname === "/") return NextResponse.next();

  // Nếu admin/lecturer vào vùng khác → đưa về khu vực chính
  if (role === "Admin" && !pathname.startsWith("/admin"))
    return NextResponse.redirect(new URL("/admin", req.url));
  if (role === "Lecturer" && !pathname.startsWith("/lecturer"))
    return NextResponse.redirect(new URL("/lecturer", req.url));

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|ico|webp|mp4|webm|ogg|mp3|wav|mov)$).*)",
  ],
};
