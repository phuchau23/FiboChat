import apiService from "../core";

//login
export interface LoginRequest {
  Email: string;
  Password: string;
}

export interface LoginResponse {
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

export interface LoginWithGoogleResponse {
  statusCode: number;
  code: string;
  message: string;
  data: {
    token: string;
    success: boolean;
    message: string;
  };
}

// get user by id
export interface GetUserByIdResponse {
  statusCode: number;
  code: string;
  message: string;
  data: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    studentID: string;
    role: string;
    isVerified: boolean;
    createdAt: string;
  };
}

//change password first time for login
export interface ChangePasswordFirstTimeRequest {
  NewPassword: string;
  ConfirmNewPassword: string;
}

export interface ChangePasswordFirstTimeResponse {
  statusCode: number;
  code: string;
  message: string;
}

export const fetchAuth = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiService.post<LoginResponse, LoginRequest>("/auth/api/users/login", data);
    return response.data;
  },

  changePasswordFirstTime: async (data: ChangePasswordFirstTimeRequest): Promise<ChangePasswordFirstTimeResponse> => {
    const response = await apiService.put<ChangePasswordFirstTimeResponse, ChangePasswordFirstTimeRequest>(
      "/auth/api/users/change-password-first-time",
      data
    );
    return response.data;
  },

  getUserById: async (id: string): Promise<GetUserByIdResponse> => {
    const response = await apiService.get<GetUserByIdResponse>(`/auth/api/users/${id}`);
    return response.data;
  },

   loginWithGoogle: async (idToken: string): Promise<LoginWithGoogleResponse> => {
    const form = new FormData();
    form.append("idToken", idToken);

    const response = await apiService.post<LoginWithGoogleResponse, FormData>(
      "/auth/api/users/login-google",
      form // Không truyền JSON mode → tự động gửi multipart/form-data
    );

    return response.data;
  },
};
