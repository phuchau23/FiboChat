import apiService from "../../lib/api/core";

// ==== INTERFACES ==== //
export interface Semester {
  id: string;
  code: string;
  term: string;
  year: number;
  createdAt: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  roleInClass: string;
  status: string;
}

export interface Class {
  id: string;
  code: string;
  status: string;
  createdAt: string;
  semester?: Semester;
  lecturer?: {
    id?: string;
    fullName?: string;
  };
  students?: Student[];
}

export interface ClassResponse {
  statusCode: number;
  code: string;
  message: string;
  data: {
    items: Class[];
    totalItems: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export interface ClassWithStudents {
  id: string;
  code: string;
  status: string;
  createdAt: string;
  lecturer?: {
    id?: string;
    fullName?: string;
  };
  students: Student[];
}

export interface ClassStudentsResponse {
  statusCode: number;
  code: string;
  message: string;
  data: ClassWithStudents[]; // đúng với API
}

// ==== API SERVICE ==== //
export const fetchClasses = {
  // ✅ Lấy danh sách lớp theo lecturerId (có phân trang)
  getAllByLecturer: async (lecturerId: string, page = 1, pageSize = 10): Promise<ClassResponse> => {
    const res = await apiService.get<ClassResponse>(
      `/auth/api/classes/lecturer/${lecturerId}?page=${page}&pageSize=${pageSize}`
    );
    return res.data;
  },

  // ✅ Lấy danh sách sinh viên theo classId
  getStudentsByClassId: async (classId: string): Promise<ClassStudentsResponse> => {
    const res = await apiService.get<ClassStudentsResponse>(`/auth/api/classes/${classId}/students`);
    return res.data;
  },
};
