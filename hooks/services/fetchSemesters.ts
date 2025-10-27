import apiService from "../../lib/api/core";

export interface Semester {
  id: string;
  code: string;
  term: string;
  year: number;
  status: string;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface SemesterResponse {
  statusCode: number;
  code: string;
  message: string;
  data: {
    items: Semester[];
    totalItems: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export const fetchSemester = {
  getAll: async (page = 1, pageSize = 10): Promise<SemesterResponse> => {
    const response = await apiService.get<SemesterResponse>(`/auth/api/semesters?page=${page}&pageSize=${pageSize}`);
    return response.data;
  },
};
