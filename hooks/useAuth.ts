import { fetchAuth } from "@/lib/api/services/fetchAuth";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api/core";
import { decodeToken } from "@/utils/jwt";
import { getAuthCookieConfig } from "@/utils/cookieConfig";
import { handleGoogleRedirectResult, signInWithGoogle } from "@/lib/firebase/auth";
import { toast } from "./use-toast";

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
        const userId = decoded?.nameid;

        if (userId) {
          setCookie("user-id", userId, getAuthCookieConfig(rememberMe)); // 👈 lưu cookie userId
        }
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
  const changePasswordFirstTime = async (NewPassword: string, ConfirmNewPassword: string) => {
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
    setError(null);

    const result = await signInWithGoogle(); // popup / redirect logic

    // User đóng popup → return sớm → KHÔNG lỗi, KHÔNG disable UI lâu
    if (!result) return;

    try {
      setLoading(true);
      await loginWithGoogle(result.idToken, rememberMe);
    } catch (err) {
      if (isApiError(err)) setError(err.message);
      else setError("Đăng nhập Google thất bại");
    } finally {
      setLoading(false);
    }
  };

    // =========================
  // FORGOT PASSWORD
  // =========================
  const forgotPassword = async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetchAuth.forgotPassword({ email });
      if (res.statusCode === 200) {
        toast({
          title: "Thành công",
          description: res.message || "Vui lòng kiểm tra email để đặt lại mật khẩu.",
        });
        return true;
      } else {
        setError(res.message || "Gửi email thất bại");
        toast({
          title: "Thất bại",
          description: res.message || "Không thể gửi email đặt lại mật khẩu.",
          variant: "destructive",
        });
        return false;
      }
    } catch (err: unknown) {
      if (isApiError(err)) {
        setError(err.message);
        toast({
          title: "Lỗi",
          description: err.message,
          variant: "destructive",
        });
      } else {
        setError("Có lỗi xảy ra khi gửi yêu cầu");
        toast({
          title: "Lỗi",
          description: "Có lỗi xảy ra, vui lòng thử lại sau.",
          variant: "destructive",
        });
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // RESET PASSWORD
  // =========================
  const resetPassword = async (token: string, newPassword: string, confirmPassword: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetchAuth.resetPassword({
        Token: token,
        NewPassword: newPassword,
        ConfirmPassword: confirmPassword,
      });

      if (res.statusCode === 200) {
        toast({
          title: "Thành công",
          description: res.message || "Đổi mật khẩu thành công.",
        });
        router.push("/login");
        return true;
      } else {
        setError(res.message || "Đổi mật khẩu thất bại");
        toast({
          title: "Thất bại",
          description: res.message || "Đổi mật khẩu thất bại.",
          variant: "destructive",
        });
        return false;
      }
    } catch (err: unknown) {
      if (isApiError(err)) {
        setError(err.message);
        toast({
          title: "Lỗi",
          description: err.message,
          variant: "destructive",
        });
      } else {
        setError("Đổi mật khẩu thất bại");
        toast({
          title: "Lỗi",
          description: "Có lỗi xảy ra khi đặt lại mật khẩu.",
          variant: "destructive",
        });
      }
      return false;
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

  return { login, changePasswordFirstTime, loginWithGoogle, loginWithGoogleProvider, forgotPassword, resetPassword, loading, error };
}
