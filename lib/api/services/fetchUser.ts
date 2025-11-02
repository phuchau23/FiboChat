import apiService from "../core";

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  studentID: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  sex?: string;
  address?: string;
}

export interface UserPagination {
  items: User[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface RegisterUserRequest {
  Email: string;
  Firstname: string;
  Lastname: string;
  StudentID: string;
}

export interface RegisterUserResponse {
  statusCode: number;
  code: string;
  message: string;
  data: {
    success: boolean;
    message: string;
  };
}

export interface UserApiResponse {
  statusCode: number;
  code: string;
  message: string;
  data: UserPagination;
}

export interface DeleteUserResponse {
  statusCode: number;
  code: string;
  message: string;
}
export interface UserProfile {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  studentID: string;
  sex: string;
  address: string;
  dateOfBirth: string;
  avatarUrl?: string;
  classId?: string;
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
  getAllUsers: async (page = 1, pageSize = 10): Promise<UserApiResponse> => {
    const response = await apiService.get<UserApiResponse>("/auth/api/users", { page, pageSize });
    return response.data;
  },

  createUser: async (formData: FormData): Promise<RegisterUserResponse> => {
    const response = await apiService.post<RegisterUserResponse>("/auth/api/users/register", formData);
    return response.data;
  },

  deleteUser: async (id: string): Promise<DeleteUserResponse> => {
    const response = await apiService.delete<DeleteUserResponse>(`/auth/api/users/${id}`);
    return response.data;
  },
  getUserProfile: async (): Promise<UserProfileResponse> => {
    const response = await apiService.get<UserProfileResponse>("/auth/api/users/get-user-profile");
    return response.data;
  },

  // --- Cập nhật hồ sơ người dùng ---
  updateUserProfile: async (payload: UpdateProfilePayload): Promise<UpdateProfileResponse> => {
    const formData = new FormData();
    formData.append("Firstname", payload.firstname);
    formData.append("Lastname", payload.lastname);
    if (payload.phoneNumber) formData.append("PhoneNumber", payload.phoneNumber);
    if (payload.dateOfBirth) formData.append("DateOfBirth", payload.dateOfBirth);
    if (payload.sex) formData.append("Sex", payload.sex);
    if (payload.address) formData.append("Address", payload.address);
    if (payload.AvatarFile) formData.append("AvatarFile", payload.AvatarFile);

    const response = await apiService.put<UpdateProfileResponse>("/auth/api/users/update-profile", formData);

    return response.data;
  },
};
