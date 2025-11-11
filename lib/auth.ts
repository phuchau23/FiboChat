import { decodeToken } from "@/utils/jwt";

export interface DecodedToken {
  sub?: string;
  sid?: string;
  nameid?: string;
  email?: string;
  exp?: number;
  iat?: number;
  [k: string]: unknown;
}

export function isDecodedToken(v: unknown): v is DecodedToken {
  return !!v && typeof v === "object";
}

export function safeDecodeAuthToken(tokenCookie?: string): DecodedToken | null {
  if (!tokenCookie) return null;
  try {
    const raw = decodeToken(tokenCookie) as unknown;
    return isDecodedToken(raw) ? (raw as DecodedToken) : null;
  } catch {
    return null;
  }
}

/** Ưu tiên lấy userId từ các claim thường gặp */
export function pickUserIdFromToken(t: DecodedToken | null): string | undefined {
  return (
    (t?.sid as string | undefined) ??
    (t?.sub as string | undefined) ??
    (t?.nameid as string | undefined)
  );
}
