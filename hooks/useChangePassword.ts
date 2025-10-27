import { useMutation } from "@tanstack/react-query";
import { fetchChangePassword } from "@/hooks/services/fetchChangePassword";
import { ApiError } from "@/lib/api/core";

interface ChangePasswordVariables {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordResult {
  success: boolean;
  message: string;
}

export function useChangePassword() {
  return useMutation<ChangePasswordResult, ApiError, ChangePasswordVariables>({
    mutationFn: async ({ oldPassword, newPassword, confirmPassword }) => {
      const res = await fetchChangePassword.changePassword(oldPassword, newPassword, confirmPassword);
      return {
        success: res.statusCode === 200,
        message: res.message,
      };
    },
    onError: (error) => {
      console.error("❌ Change password failed:", error);
    },
  });
}
