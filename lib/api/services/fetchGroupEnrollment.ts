import apiService from "@/lib/api/core";

// ====== INTERFACES ======
export interface Lecturer {
  id: string;
  fullName: string;
}

export interface Semester {
  id: string;
  code: string;
  year: number;
  term?: string;
}

export interface ClassInfo {
  id: string;
  code: string;
  status: string;
  lecturer: Lecturer;
  semester: Semester;
}

export interface GroupInfo {
  id: string;
  name: string;
  description?: string;
  status?: string;
}

export interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentID: string;
  phoneNumber?: string;
}

export interface ClassEnrollment {
  id: string;
  status: string;
  roleInClass: string;
  user: UserInfo;
  class: ClassInfo;
  group?: GroupInfo | null;
  createdAt: string;
}

export interface ClassEnrollmentResponse {
  statusCode: number;
  code: string;
  message: string;
  data: ClassEnrollment;
}

export interface ClassEnrollmentsPagination {
  items: ClassEnrollment[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ClassEnrollmentsResponse {
  statusCode: number;
  code: string;
  message: string;
  data: ClassEnrollmentsPagination;
}

// ====== API CALLS ======
export const fetchClassEnrollment = {
  // 🧠 Lấy ghi danh của user
  getByUser: async (userId: string): Promise<ClassEnrollmentResponse> => {
    const response = await apiService.get<ClassEnrollmentResponse>(`/auth/api/class-enrollments/user/${userId}`);
    return response.data;
  },

  // 🧠 Lấy danh sách thành viên trong group
  getByGroup: async (groupId: string, page = 1, pageSize = 10): Promise<ClassEnrollmentsResponse> => {
    const response = await apiService.get<ClassEnrollmentsResponse>(
      `/auth/api/class-enrollments/group/${groupId}?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  },
};
