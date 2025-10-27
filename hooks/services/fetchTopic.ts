import apiService from "../../lib/api/core";

export interface Topic {
  id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
}

export interface TopicResponse {
  statusCode: number;
  code: string;
  message: string;
  data: {
    items: Topic[];
    totalItems: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export interface CreateUpdateResponse {
  statusCode: number;
  code: string;
  message: string;
  data: Topic;
}

export const fetchTopic = {
  getAll: async (page = 1, pageSize = 10): Promise<TopicResponse> => {
    const response = await apiService.get<TopicResponse>(`/course/api/topics?page=${page}&pageSize=${pageSize}`);
    return response.data;
  },

  create: async (masterTopicId: string, name: string, description: string): Promise<CreateUpdateResponse> => {
    const formData = new FormData();
    formData.append("MasterTopicId", masterTopicId);
    formData.append("Name", name);
    formData.append("Description", description);

    const res = await apiService.post<CreateUpdateResponse>(`/course/api/topics`, formData);
    return res.data;
  },

  update: async (id: string, name: string, description: string): Promise<CreateUpdateResponse> => {
    const formData = new FormData();
    formData.append("Name", name);
    formData.append("Description", description);

    const res = await apiService.put<CreateUpdateResponse>(`/course/api/topics/${id}`, formData);
    return res.data;
  },
};
