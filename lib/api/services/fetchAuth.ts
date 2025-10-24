import apiService from "../core";

//login
export interface LoginRequest{
  Email: string;
  Password: string;
}

export interface LoginResponse{
    statusCode: number;
    code: string;
    message: string;
    data: {
        token: string;
        success: boolean;
        message: string;
        isVerifiled: boolean;
    };
}

//change password first time for login
export interface ChangePasswordFirstTimeRequest{
    NewPassword: string;
    ConfirmNewPassword: string;
}

export interface ChangePasswordFirstTimeResponse{
    statusCode: number;
    code: string;
    message: string;
}

export const fetchAuth = {
  login: async (data: LoginRequest) : Promise<LoginResponse> => {
    const response = await apiService.post<LoginResponse, LoginRequest>("/auth/api/users/login", data);
    return response.data;
  },

  changePasswordFirstTime: async (data: ChangePasswordFirstTimeRequest) : Promise<ChangePasswordFirstTimeResponse> => {
    const response = await apiService.put<ChangePasswordFirstTimeResponse, ChangePasswordFirstTimeRequest>("/auth/api/users/change-password-first-time", data);
    return response.data;
  }
};