export const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";

/** Chấp nhận mọi UUID hợp lệ (v1–v8), phù hợp log của bạn (v7) */
export const isUuid = (v?: string | null): v is string =>
  !!v && /^[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}$/.test(v);

/** (Tuỳ chọn) Check biến thể RFC4122 (nibble 3 là 8/9/a/b) */
export const isUuidRfc4122 = (v?: string | null): v is string =>
  !!v &&
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(
    v
  );
export interface DecodedToken {
  sub?: string;
  sid?: string;
  nameid?: string;
  email?: string;
  exp?: number;
  iat?: number;
  // Cho phép claim khác mà không cần any
  [k: string]: unknown;
}

// Type-guard: kiểm tra tối thiểu để dùng như DecodedToken
export function isDecodedToken(v: unknown): v is DecodedToken {
  if (!v || typeof v !== "object") return false;
  // không bắt buộc đủ field; chỉ cần object là đủ để dùng optional chaining
  return true;
}


import { decodeToken } from "@/utils/jwt";

export function safeDecodeAuthToken(tokenCookie?: string): DecodedToken | null {
  if (!tokenCookie) return null;
  try {
    const raw = decodeToken(tokenCookie) as unknown; // không any
    return isDecodedToken(raw) ? (raw as DecodedToken) : null;
  } catch {
    return null;
  }
}