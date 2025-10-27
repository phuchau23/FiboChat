import apiService from "../../lib/api/core";

export interface Domain {
  id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
}

export interface DomainResponse {
  statusCode: number;
  code: string;
  message: string;
  data: {
    items: Domain[];
    totalItems: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export interface BaseApiResponse {
  statusCode: number;
  code: string;
  message: string;
}

export const fetchDomain = {
  getAll: async (page = 1, pageSize = 10): Promise<DomainResponse> => {
    const response = await apiService.get<DomainResponse>(`/course/api/domains?page=${page}&pageSize=${pageSize}`);
    return response.data;
  },

  create: async (name: string, description: string): Promise<BaseApiResponse> => {
    const formData = new FormData();
    formData.append("Name", name);
    formData.append("Description", description);
    const response = await apiService.post<BaseApiResponse>(`/course/api/domains`, formData);
    return response.data;
  },

  update: async (id: string, name: string, description: string): Promise<BaseApiResponse> => {
    const formData = new FormData();
    formData.append("Name", name);
    formData.append("Description", description);
    const response = await apiService.put<BaseApiResponse>(`/course/api/domains/${id}`, formData);
    return response.data;
  },
};
