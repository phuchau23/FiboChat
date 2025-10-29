import { fetchAuth } from "@/lib/api/services/fetchAuth";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api/core";
import { decodeToken } from "@/utils/jwt";
import { getAuthCookieConfig } from "@/utils/cookieConfig";
import { handleGoogleRedirectResult, signInWithGoogle } from "@/lib/firebase/auth";

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isApiError = (error: unknown): error is ApiError =>
    typeof error === "object" && error !== null && "message" in error;

  // LOGIN
  const login = async (Email: string, Password: string, rememberMe = false) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetchAuth.login({ Email, Password });

      if (res.data?.token) {
        setCookie("auth-token", res.data.token, getAuthCookieConfig(rememberMe));

        const decoded = decodeToken(res.data.token);
        const role = decoded?.role;

        if (res.data.isVerifiled === false) {
          router.push("/change-password");
          return;
        }

        switch (role) {
          case "Admin":
            router.push("/admin");
            break;
          case "Lecturer":
            router.push("/lecturer");
            break;
          default:
            router.push("/");
        }
      } else {
        setError(res.message || "Đăng nhập thất bại");
      }
    } catch (err: unknown) {
      if (isApiError(err)) setError(err.message);
      else setError("Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  // CHANGE PASSWORD FIRST TIME
  const changePasswordFirstTime = async (
    NewPassword: string,
    ConfirmNewPassword: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetchAuth.changePasswordFirstTime({
        NewPassword,
        ConfirmNewPassword,
      });

      if (res.statusCode === 200) {
        router.push("/");
      } else {
        setError(res.message || "Đổi mật khẩu thất bại");
      }
    } catch (err: unknown) {
      if (isApiError(err)) {
        setError(err.message);
        if (err.status === 401) router.push("/login");
      } else setError("Đổi mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };

   // GOOGLE LOGIN
const loginWithGoogle = async (idToken: string, rememberMe = false) => {
  try {
    setLoading(true);
    setError(null);

    const res = await fetchAuth.loginWithGoogle(idToken);

    if (!res.data?.token) {
      setError(res.data?.message || res.message || "Đăng nhập Google thất bại");
      return;
    }

    setCookie("auth-token", res.data.token, getAuthCookieConfig(rememberMe));
    const decoded = decodeToken(res.data.token);
    const role = decoded?.role;

    switch (role) {
      case "Admin":
        router.push("/admin");
        break;
      case "Lecturer":
        router.push("/lecturer");
        break;
      default:
        router.push("/");
    }
  } finally {
    setLoading(false);
  }
};

// POPUP Login Google
const loginWithGoogleProvider = async (rememberMe = false) => {
  try {
    setLoading(true);
    const result = await signInWithGoogle();
    if (result?.idToken) {
      await loginWithGoogle(result.idToken, rememberMe);
    }
  } catch (err: unknown) {
    if (isApiError(err)) setError(err.message);
    else setError("Đăng nhập Google thất bại");
  } finally {
    setLoading(false);
  }
};

// Fallback Redirect Google Login
useEffect(() => {
  (async () => {
    const result = await handleGoogleRedirectResult();
    if (result?.idToken) await loginWithGoogle(result.idToken);
  })();
}, []);

  return { login, changePasswordFirstTime, loginWithGoogle, loginWithGoogleProvider, loading, error };
}

