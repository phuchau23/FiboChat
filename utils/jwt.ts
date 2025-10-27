import { jwtDecode } from "jwt-decode";

export interface DecodedToken {
  nameid: string;
  email?: string;
  exp?: number;
  iat?: number;
}

export function decodeToken(token: string): DecodedToken | null {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error("Decode token error:", error);
    return null;
  }
}
