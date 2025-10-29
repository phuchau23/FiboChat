import { deleteCookie, getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "./jwt";

export interface CookieOptions {
  maxAge?: number;
  path?: string;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
  httpOnly?: boolean;
  domain?: string;
}

/**
 * Helpers runtime-safe
 */
function isProd() {
  return process.env.NODE_ENV === "production";
}

function isBrowser() {
  return typeof window !== "undefined";
}

function isHttps() {
  if (isBrowser()) return window.location.protocol === "https:";
  return isProd();
}

/**
 * Phát hiện host hiện tại (nếu phía server – Next.js – có thể đi từ VERCEL_URL)
 */
function currentHostname(): string | undefined {
  if (isBrowser()) return window.location.hostname;
  // Vercel set VERCEL_URL = "<project>.vercel.app" (không có protocol)
  const vercel = process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL;
  if (vercel) return vercel.replace(/^https?:\/\//, "");
  return undefined;
}

/**
 * Quyết định domain để set cookie:
 * - Nếu env COOKIE_DOMAIN / NEXT_PUBLIC_COOKIE_DOMAIN được cấu hình, dùng giá trị đó (ví dụ: ".fibo.edu.vn")
 * - Nếu đang chạy trên *.vercel.app → KHÔNG set domain (host-only)
 * - Ngược lại (prod nhưng không vercel) → nếu hostname là subdomain của fibo.edu.vn,
 *   có thể tự động dùng ".fibo.edu.vn"; còn không thì để host-only.
 */
function resolveCookieDomain(): string | undefined {
  const domainFromEnv =
    process.env.COOKIE_DOMAIN || process.env.NEXT_PUBLIC_COOKIE_DOMAIN;
  if (domainFromEnv && domainFromEnv.trim() !== "") {
    return domainFromEnv.trim();
  }

  const host = currentHostname();
  if (!host) return undefined;

  const isVercel = host.endsWith(".vercel.app");
  if (isVercel) {
    // Host-only trên vercel để chắc chắn cookie dính
    return undefined;
  }

  // Tự động gom về parent domain nếu là fibo.edu.vn (prod thật)
  if (host === "fibo.edu.vn" || host.endsWith(".fibo.edu.vn")) {
    return ".fibo.edu.vn";
  }

  // Mặc định: host-only
  return undefined;
}

/**
 * sameSite auto:
 * - Mặc định 'lax' đủ cho hầu hết SPA cùng site
 * - Muốn cross-site (SSO qua domain khác) → đặt env COOKIE_SAMESITE=none
 */
function resolveSameSite(): "strict" | "lax" | "none" {
  const raw = (process.env.COOKIE_SAMESITE || process.env.NEXT_PUBLIC_COOKIE_SAMESITE || "").toLowerCase();
  if (raw === "none") return "none";
  if (raw === "strict") return "strict";
  // default
  return "lax";
}

/**
 * Lấy cấu hình cookie chung cho môi trường hiện tại
 */
export function getSecureCookieConfig(
  customOptions: Partial<CookieOptions> = {}
): CookieOptions {
  const secure = isHttps();
  const sameSite = resolveSameSite();
  const domain = resolveCookieDomain();

  const defaultConfig: CookieOptions = {
    maxAge: 60 * 60 * 24 * 7, // 7 ngày
    path: "/",
    secure,
    sameSite,
    httpOnly: false, // ⚠️ Chỉ dùng khi set từ client. Prod nên set HttpOnly ở server (API/Route Handler)
    domain,          // trên vercel sẽ là undefined (host-only)
  };

  return { ...defaultConfig, ...customOptions };
}

/**
 * Cookie cho token đăng nhập (auth-token)
 */
export function getAuthCookieConfig(rememberMe = false): CookieOptions {
  const secure = isHttps();
  const sameSite = resolveSameSite();
  const domain = resolveCookieDomain();

  return {
    maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7,
    path: "/",
    secure,
    sameSite,        // 'lax' hoặc 'none' theo env
    httpOnly: false, // ⚠️ client-only; nếu set ở server hãy dùng HttpOnly: true
    domain,          // undefined trên vercel
  };
}

/**
 * Dọn dẹp token hết hạn mỗi khi reload app
 * Dùng cho AuthInitProvider
 */
export function cleanExpiredTokenOnLoad() {
  const token = getCookie("auth-token");
  if (!token) return;

  try {
    const decoded = jwtDecode<DecodedToken>(token as string);
    const now = Date.now() / 1000; // giây hiện tại

    if (decoded?.exp && decoded.exp < now) {
      // Xóa cookie chắc chắn: thử cả host-only lẫn domain cụ thể (nếu có)
      try {
        deleteCookie("auth-token", { path: "/" });
      } catch {}
      const domain = resolveCookieDomain();
      if (domain) {
        try {
          deleteCookie("auth-token", { path: "/", domain });
        } catch {}
      }
    }
  } catch {
    console.error("[AuthInitProvider] Invalid token → cookie deleted");

    // Token lỗi → xóa mạnh tay
    try {
      deleteCookie("auth-token", { path: "/" });
    } catch {}
    const domain = resolveCookieDomain();
    if (domain) {
      try {
        deleteCookie("auth-token", { path: "/", domain });
      } catch {}
    }
  }
}
