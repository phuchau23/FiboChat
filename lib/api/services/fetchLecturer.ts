import apiService from "../core";

export interface Lecturer{
  lecturerId: string;
  fullName: string;
  email: string;
  status: string;
  gender: string;
}

export interface LecturerApiResponse{
  statusCode: number;
  code: string;
  message: string;
  data: Lecturer[];
}

export interface CreateLecturerRequest{
  FullName: string;
  Email: string;
}

export interface UpdateLecturerRequest{
  id: string;
  FullName: string;
  Gender: string;
}

export interface BaseActionResponse {
  statusCode: number;
  code: string;
  message: string;
  data: {
    success: boolean;
    message: string;
  };
}

export interface SingleLecturerResponse {
  statusCode: number;
  code: string;
  message: string;
  data: Lecturer;
}

// Gett all
export const fetchLecturer = {
  getAllLecturers: async () : Promise<LecturerApiResponse> => {
    const response = await apiService.get<LecturerApiResponse>('/auth/api/lecturers');
    return response.data;
  },

  // Get by id
  getLecturerById: async (id: string): Promise<SingleLecturerResponse> => {
    const response = await apiService.get<SingleLecturerResponse>(`/auth/api/lecturers/${id}`);
    return response.data;
  },

  // Create
  createLecturer: async (formData: FormData): Promise<BaseActionResponse> => {
    const response = await apiService.post<BaseActionResponse>('/auth/api/lecturers', formData);
    return response.data;
  },

  // Put
  updateLecturer: async (id: string, formData: FormData): Promise<BaseActionResponse> => {
    const response = await apiService.put<BaseActionResponse>(`/auth/api/lecturers/${id}`, formData);
    return response.data;
  },

  // Delete
  deleteLecturer: async (id: string): Promise<BaseActionResponse> => {
    const response = await apiService.delete<BaseActionResponse>(`/auth/api/lecturers/${id}`);
    return response.data;
  },
}
