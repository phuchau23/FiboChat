import apiService from "@/lib/api/core";


export enum SemesterStatus {
  Active = "Active",
  Inactive = "Inactive",
}

export interface Semester {
  id: string;
  code: string;
  term: string;
  year: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  status: SemesterStatus;
}

export interface SemesterPagination {
  items: Semester[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

export interface SemesterApiResponse {
  statusCode: number;
  code: string;
  message: string;
  data: SemesterPagination;
}

export interface CreateSemesterRequest {
  code: string;
  term: string;
  year: number;
  startDate: string;
  endDate: string;
}

export interface CreateSemesterResponse {
 statusCode: number;
 code: string;
 message: string;
 data: Semester;
}

export const  fetchSemester = {
  getAllSemesters: async (page = 1, pageSize = 10) : Promise<SemesterApiResponse> => {
    const response = await apiService.get<SemesterApiResponse>(`/auth/api/semesters`, {
        page,
        pageSize,
      });
    return response.data;
  },

  getSemesterById: async (id: string) => {
    return apiService.get<{ data: Semester }>(`/auth/api/semesters/${id}`);
  },

  createSemester: async (data: FormData): Promise<CreateSemesterResponse> => {
    const response = await apiService.post<CreateSemesterResponse>('/auth/api/semesters', data);
    return response.data;
  },

  updateSemester: async (id: string, data: FormData): Promise<CreateSemesterResponse | null> => {
    const response = await apiService.put<CreateSemesterResponse>(`/auth/api/semesters/${id}`, data);
    return response.data;
  },

  deleteSemester: async (id: string): Promise<Semester> => {
    const response = await apiService.delete<{data: Semester}>(`/auth/api/semesters/${id}`);
    return response.data.data;
  },
}