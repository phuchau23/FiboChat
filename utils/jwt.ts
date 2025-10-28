import { jwtDecode } from 'jwt-decode';

export interface DecodedToken {
  nameid: string;
  email?: string;
  role?: string;
  exp?: number;
  iat?: number;
}

export function decodeToken(token: string): DecodedToken | null {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error('Decode token error:', error);
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded?.exp) return true;
  return decoded.exp * 1000 < Date.now();
}
