import apiService from "../core";

// Lecturer trong Class
export interface ClassLecturer {
  id: string;
  fullName: string;
}

// Semester trong Class
export interface ClassSemester {
  id: string;
  code: string;
  term: string;
  year: number;
  createdAt: string;
}

export interface Class {
  id: string;
  code: string;
  status: string;
  createdAt: string;
  lecturer: ClassLecturer;
  semester: ClassSemester;
}

// Response khi gọi Get All (có phân trang)
export interface ClassPaginationData {
  items: Class[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ClassApiResponse {
  statusCode: number;
  code: string;
  message: string;
  data: ClassPaginationData;
}

// Response khi gọi Create / Update / GetById
export interface ClassSingleResponse {
  statusCode: number;
  code: string;
  message: string;
  data: Class;
}

export interface CreateClassRequest {
  SemesterId: string;
  Code: string;
  LecturerId: string;
}


export const fetchClass = {
  getAllClasses: async (page = 1, pageSize = 10): Promise<ClassApiResponse> => {
    const response = await apiService.get<ClassApiResponse>(
      `/auth/api/classes?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  },

  // GET BY ID
  getClassById: async (id: string): Promise<ClassSingleResponse> => {
    const response = await apiService.get<ClassSingleResponse>(
      `/auth/api/classes/${id}`
    );
    return response.data;
  },

  // CREATE CLASS
  createClass: async (data: FormData): Promise<ClassSingleResponse> => {
    const response = await apiService.post<ClassSingleResponse>(
      "/auth/api/classes",
      data
    );
    return response.data;
  },

  // UPDATE CLASS
  updateClass: async (
    id: string,
    data: FormData
  ): Promise<ClassSingleResponse> => {
    const response = await apiService.put<ClassSingleResponse>(
      `/auth/api/classes/${id}`,
      data
    );
    return response.data;
  },

  // DELETE CLASS
  deleteClass: async (id: string): Promise<void> => {
    await apiService.delete(`/auth/api/classes/${id}`);
  },
};
