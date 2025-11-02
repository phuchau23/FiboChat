import apiService from "@/lib/api/core";

export enum TopicStatus {
  Active = "Active",
  Inactive = "Inactive",
}

export enum MasterTopicStatus {
  Active = "Active",
  Inactive = "Inactive",
}

export interface MasterTopic {
  id: string;
  name: string;
  description: string;
  status: MasterTopicStatus;
  createdAt: string;
}
export interface Topic {
  id: string;
  name: string;
  description: string;
  status: TopicStatus;
  createdAt: string;
  masterTopic: MasterTopic;
}

export interface TopicPagination {
  items: Topic[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface TopicApiResponse {
  statusCode: number;
  code: string;
  message: string;
  data: TopicPagination;
}

export interface CreateTopicResponse {
  statusCode: number;
  code: string;
  message: string;
  data: Topic;
}

export interface SingleTopicResponse {
  statusCode: number;
  code: string;
  message: string;
  data: Topic;
}

export const fetchTopic = {
  getAllTopics: async (page = 1, pageSize = 10): Promise<TopicApiResponse> => {
    const response = await apiService.get<TopicApiResponse>(`/course/api/topics`, {
      page,
      pageSize,
    });
    return response.data;
  },

  getTopicById: async (id: string): Promise<SingleTopicResponse> => {
    const response = await apiService.get<SingleTopicResponse>(`/course/api/topics/${id}`);
    return response.data;
  },

  createTopic: async (formData: FormData): Promise<CreateTopicResponse> => {
    const response = await apiService.post<CreateTopicResponse>(`/course/api/topics`, formData);
    return response.data;
  },

  updateTopic: async (id: string, formData: FormData): Promise<CreateTopicResponse> => {
    const response = await apiService.put<CreateTopicResponse>(`/course/api/topics/${id}`, formData);
    return response.data;
  },

  deleteTopic: async (id: string): Promise<SingleTopicResponse> => {
    const response = await apiService.delete<SingleTopicResponse>(`/course/api/topics/${id}`);
    return response.data;
  },
  // Lấy danh sách chủ đề theo giảng viên
  getTopicsByLecturer: async (lecturerId: string, page = 1, pageSize = 10): Promise<TopicApiResponse> => {
    const response = await apiService.get<TopicApiResponse>(`/course/api/topics/lecturer/${lecturerId}`, {
      page,
      pageSize,
    });
    return response.data;
  },

  // Lấy tất cả chủ đề theo giảng viên (bỏ phân trang nếu cần)
  getAllTopicsByLecturer: async (lecturerId: string): Promise<TopicApiResponse> => {
    const response = await apiService.get<TopicApiResponse>(`/course/api/topics/lecturer/${lecturerId}`);
    return response.data;
  },
};
