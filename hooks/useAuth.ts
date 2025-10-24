import { fetchAuth } from "@/lib/api/services/fetchAuth";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApiError } from "@/lib/api/core";

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function isApiError(error: unknown): error is ApiError {
  return typeof error === "object" && error !== null && "message" in error;
}

  //login
  const login = async (Email: string, Password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchAuth.login({ Email, Password });

        if (response.data.token){
          setCookie("auth-token", response.data.token);
        }

        if (response.data.isVerifiled === false){
          router.push("/change-password");
          return;
        }

        if (response.data.success === true){
          router.push("/");
        } else {
          setError(response.message || "Đăng nhập thất bại");
        }
        
    } catch (error : unknown) {
      if (isApiError(error)) {
        setError(error.message);
      } else {
        setError("Đăng nhập thất bại");
      }
    } finally {
      setLoading(false);
    }
  };

  //change password first time 
  const changePasswordFirstTime = async (NewPassword: string, ConfirmNewPassword: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchAuth.changePasswordFirstTime({ NewPassword, ConfirmNewPassword });

      if (response.statusCode === 200){
          router.push("/");
       } else {
            setError(response.message || "Đổi mật khẩu thất bại");
        } 
   } catch (error : unknown) {
     if (isApiError(error)) {
        setError(error.message);
        if (error.status === 401) router.push("/login");
      } else {
        setError("Đổi mật khẩu thất bại");
      }
  } finally {
    setLoading(false);
  }
};

  return {
    login,
    changePasswordFirstTime,
    loading,
    error,
  }
}




