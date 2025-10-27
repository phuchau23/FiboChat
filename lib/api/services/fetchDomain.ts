import apiService from "../core";

export enum DomainStatus {
  Active = "Active",
  Inactive = "Inactive",
}

export interface Domain {
  id: string;
  name: string;
  description: string;
  status: DomainStatus;
  createdAt: string;
}

export interface DomainPagination {
  items: Domain[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface DomainApiResponse {
  statusCode: number;
  code: string;
  message: string;
  data: DomainPagination;
}

export interface CreateDomainRequest {
  name: string;
  description: string;
}

export interface CreateDomainResponse {
  statusCode: number;
  code: string;
  message: string;
  data: Domain;
}

export const fetchDomain = {
  getAllDomains: async (
    page = 1,
    pageSize = 10
  ): Promise<DomainApiResponse> => {
    const response = await apiService.get<DomainApiResponse>(
      `/course/api/domains`,
      { page, pageSize }
    );
    return response.data;
  },

  getDomainById: async (id: string) => {
    return apiService.get<{ data: Domain }>(`/course/api/domains/${id}`);
  },

  createDomain: async (data: FormData): Promise<CreateDomainResponse> => {
    const response = await apiService.post<CreateDomainResponse>(
      `/course/api/domains`,
      data
    );
    return response.data;
  },

  updateDomain: async (
    id: string,
    data: FormData
  ): Promise<CreateDomainResponse> => {
    const response = await apiService.put<CreateDomainResponse>(
      `/course/api/domains/${id}`,
      data
    );
    return response.data;
  },

  deleteDomain: async (id: string): Promise<Domain> => {
    const response = await apiService.delete<{ data: Domain }>(
      `/course/api/domains/${id}`
    );
    return response.data.data;
  },
};
