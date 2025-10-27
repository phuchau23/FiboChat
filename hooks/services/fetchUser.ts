import apiService from "../../lib/api/core";

export interface UserProfile {
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber?: string;
  studentID: string;
  dateOfBirth?: string;
  avatarUrl?: string;
  sex?: string;
  address?: string;
}

export interface UserProfileResponse {
  statusCode: number;
  code: string;
  message: string;
  data: UserProfile;
}

export interface UpdateProfilePayload {
  firstname: string;
  lastname: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  sex?: string;
  address?: string;
  AvatarFile?: File;
  [key: string]: string | File | undefined;
}

export interface UpdateProfileResponse {
  statusCode: number;
  code: string;
  message: string;
  data: {
    success: boolean;
    message: string;
  };
}

export const fetchUser = {
  getProfile: async (): Promise<UserProfileResponse> => {
    try {
      const response = await apiService.get<UserProfileResponse>("/auth/api/users/get-user-profile");
      return response.data;
    } catch (error) {
      // ✅ Không dùng any — xác định rõ kiểu lỗi
      if (error instanceof Error) {
        console.error("Lỗi khi tải hồ sơ:", error.message);
      }
      throw error;
    }
  },

  updateProfile: async (payload: UpdateProfilePayload): Promise<UpdateProfileResponse> => {
    try {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      const response = await apiService.put<UpdateProfileResponse>("/auth/api/users/update-profile", formData);

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Lỗi khi cập nhật hồ sơ:", error.message);
      }
      throw error;
    }
  },
};
