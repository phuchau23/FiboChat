"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getCookie, deleteCookie } from "cookies-next";
import { useAuth } from "@/hooks/useAuth";
import { fetchAuth } from "@/lib/api/services/fetchAuth";
import { decodeToken } from "@/utils/jwt";

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
  changePassword: (
    newPassword: string,
    confirmPassword: string
  ) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
    login,
    changePasswordFirstTime,
    loading: authLoading,
    error: authError,
  } = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Lấy user từ token cookie
  const refreshUser = async () => {
    const token = getCookie("auth-token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    const decoded = decodeToken(String(token));
    if (!decoded || (decoded.exp && decoded.exp * 1000 < Date.now())) {
      deleteCookie("auth-token");
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetchAuth.getUserById(decoded.nameid);
      setUser(res.data);
    } catch (err) {
      console.error("Lỗi lấy user:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Logout
  const logout = () => {
    deleteCookie("auth-token");
    setUser(null);
  };

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
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuthContext must be used inside <AuthProvider />");
  return context;
}
