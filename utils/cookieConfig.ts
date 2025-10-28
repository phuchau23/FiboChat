import { deleteCookie, getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "./jwt";

export interface CookieOptions {
  maxAge?: number;
  path?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  httpOnly?: boolean;
  domain?: string;
}

/**
 * Lấy cấu hình cookie chung cho môi trường hiện tại
 */
export function getSecureCookieConfig(customOptions: Partial<CookieOptions> = {}): CookieOptions {
  const isProduction = process.env.NODE_ENV === 'production';
  const isSecure =
    typeof window !== 'undefined' ? window.location.protocol === 'https:' : isProduction;

  const defaultConfig: CookieOptions = {
    maxAge: 60 * 60 * 24 * 7, // 7 ngày
    path: '/',
    secure: isSecure,
    sameSite: isSecure ? 'strict' : 'lax',
    httpOnly: false,
  };

  if (isProduction) {
    defaultConfig.domain = '.fibo.edu.vn';
  }

  return { ...defaultConfig, ...customOptions };
}

/**
 * Cookie cho token đăng nhập (auth-token)
 */
export function getAuthCookieConfig(rememberMe = false): CookieOptions {
  const isProduction = process.env.NODE_ENV === 'production';
  const isSecure =
    typeof window !== 'undefined' ? window.location.protocol === 'https:' : isProduction;

  return {
    maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7,
    path: '/',
    secure: isSecure,
    sameSite: 'lax',
    httpOnly: false,
    domain: isProduction ? '.fibo.edu.vn' : undefined,
  };
}

/**
 * ✅ Dọn dẹp token hết hạn mỗi khi reload app
 * Dùng cho AuthInitProvider
 */
export function cleanExpiredTokenOnLoad() {
  const token = getCookie("auth-token");
  if (!token) return;

  try {
    const decoded = jwtDecode<DecodedToken>(token as string);
    const now = Date.now() / 1000; // giây hiện tại

    // Nếu token hết hạn thì xóa cookie
    if (decoded?.exp && decoded.exp < now) {
      deleteCookie("auth-token");
    }
  } catch {
    console.error("[AuthInitProvider] Invalid token → cookie deleted");
    deleteCookie("auth-token");
  }
}

