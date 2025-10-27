import apiService from "../../lib/api/core";

export interface Lecturer {
  lecturerId: string;
  fullName: string;
  gender: string;
  status?: string;
}

export interface LecturerResponse {
  statusCode: number;
  code: string;
  message: string;
  data: Lecturer[];
}

export interface LecturerDetailResponse {
  statusCode: number;
  code: string;
  message: string;
  data: Lecturer; // chỉ 1 đối tượng
}

export const fetchLecturer = {
  getAll: async (): Promise<LecturerResponse> => {
    const response = await apiService.get<LecturerResponse>(`/auth/api/lecturers`);
    return response.data;
  },

  getById: async (id: string): Promise<LecturerDetailResponse> => {
    const response = await apiService.get<LecturerDetailResponse>(`/auth/api/lecturers/${id}`);
    return response.data;
  },
};
