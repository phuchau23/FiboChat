import apiService from "../core";

export interface ChangePasswordResponse {
  statusCode: number;
  code: string;
  message: string;
}

export const fetchChangePassword = {
  changePassword: async (
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<ChangePasswordResponse> => {
    const formData = new FormData();
    formData.append("OldPassword", oldPassword);
    formData.append("NewPassword", newPassword);
    formData.append("ConfirmNewPassword", confirmPassword);

    const response = await apiService.put<ChangePasswordResponse>("/auth/api/users/change-password", formData);

    return response.data;
  },
};
