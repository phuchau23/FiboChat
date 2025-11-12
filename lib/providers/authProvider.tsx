"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getCookie, deleteCookie } from "cookies-next";
import { useAuth } from "@/hooks/useAuth";
import { fetchAuth } from "@/lib/api/services/fetchAuth";
import { decodeToken, isTokenExpired } from "@/utils/jwt";

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  changePassword: (newPassword: string, confirmPassword: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { login, changePasswordFirstTime, loading: authLoading, error: authError } = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Refresh user từ cookie
  const refreshUser = async () => {
    const token = getCookie("auth-token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    if (isTokenExpired(String(token))) {
      deleteCookie("auth-token");
      setUser(null);
      setLoading(false);
      return;
    }

    const decoded = decodeToken(String(token));
    if (!decoded) {
      deleteCookie("auth-token");
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      //Gọi API để lấy thông tin user đầy đủ
      const res = await fetchAuth.getUserById(decoded.nameid);
      if (res && res.data) {
        setUser({
          id: res.data.id,
          firstname: res.data.firstname ?? "",
          lastname: res.data.lastname ?? "",
          email: res.data.email ?? decoded.email ?? "",
          role: res.data.role ?? decoded.role ?? "",
          isVerified: res.data.isVerified ?? false,
        });
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Lỗi lấy user:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    deleteCookie("auth-token");
    deleteCookie("user-id");
    setUser(null);
  };

  // load user khi app mount
  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: loading || authLoading,
        error: authError,
        login,
        changePassword: changePasswordFirstTime,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside <AuthProvider />");
  return ctx;
}
