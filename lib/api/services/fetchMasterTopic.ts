import apiService from "@/lib/api/core";

export enum MasterTopicStatus {
  Active = "Active",
  Inactive = "Inactive",
}

export interface Lecturer {
  lecturerId: string;
  fullName: string;
  gender: string;
  status: string;
}

export interface DomainInfo {
  id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
}

export interface SemesterInfo {
  id: string;
  code: string;
  term: string;
  year: number;
  status: string;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface MasterTopic {
  id: string;
  name: string;
  description: string;
  status: MasterTopicStatus;
  createdAt: string;
  domain: DomainInfo;
  semester?: SemesterInfo;
  lecturers: Lecturer[];
}


export interface MasterTopicPagination {
  items: MasterTopic[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface MasterTopicApiResponse {
  statusCode: number;
  code: string;
  message: string;
  data: MasterTopicPagination;
}

export interface CreateOrUpdateMasterTopicRequest {
  DomainId: string;
  SemesterId: string;
  LecturerIds: string[];
  Name: string;
  Description: string;
}

export interface CreateOrUpdateMasterTopicResponse {
  statusCode: number;
  code: string;
  message: string;
  data: MasterTopic;
}

export interface DeleteMasterTopicResponse {
  statusCode: number;
  code: string;
  message: string;
  data: MasterTopic;
}

export const fetchMasterTopic = {
 
  getAllMasterTopics: async (
    page = 1,
    pageSize = 10
  ): Promise<MasterTopicApiResponse> => {
    const response = await apiService.get<MasterTopicApiResponse>(
      `course/api/master-topics`,
      { page, pageSize }
    );
    return response.data;
  },

  getMasterTopicById: async (id: string) => {
    const response = await apiService.get<{ data: MasterTopic }>(
      `course/api/master-topics/${id}`
    );
    return response.data;
  },

  createMasterTopic: async (
    formData: FormData
  ): Promise<CreateOrUpdateMasterTopicResponse> => {
    const response = await apiService.post<CreateOrUpdateMasterTopicResponse>(
      `course/api/master-topics`,
      formData
    );
    return response.data;
  },

  updateMasterTopic: async (
    id: string,
    formData: FormData
  ): Promise<CreateOrUpdateMasterTopicResponse> => {
    const response = await apiService.put<CreateOrUpdateMasterTopicResponse>(
      `course/api/master-topics/${id}`,
      formData
    );
    return response.data;
  },

  deleteMasterTopic: async (
    id: string
  ): Promise<DeleteMasterTopicResponse> => {
    const response = await apiService.delete<DeleteMasterTopicResponse>(
      `course/api/master-topics/${id}`
    );
    return response.data;
  },
};

