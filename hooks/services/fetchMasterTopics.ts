import apiService from "../../lib/api/core";
import { Domain } from "./fetchDomains";

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

export interface Lecturer {
  lecturerId: string;
  fullName: string;
  gender: string;
  status: string;
}

export interface MasterTopic {
  id: string;
  domain: Domain;
  semester: Semester;
  lecturers: Lecturer[];
  name: string;
  description: string;
  status: string;
  createdAt: string;
}

export interface MasterTopicResponse {
  statusCode: number;
  code: string;
  message: string;
  data: {
    items: MasterTopic[];
    totalItems: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export const fetchMasterTopic = {
  getAll: async (page = 1, pageSize = 10): Promise<MasterTopicResponse> => {
    const response = await apiService.get<MasterTopicResponse>(
      `/course/api/master-topics?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  },

  create: async (
    domainId: string,
    semesterId: string,
    lecturerIds: string[],
    name: string,
    description: string
  ): Promise<MasterTopicResponse> => {
    const formData = new FormData();
    formData.append("DomainId", domainId);
    formData.append("SemesterId", semesterId);
    lecturerIds.forEach((id) => formData.append("LecturerIds", id));
    formData.append("Name", name);
    formData.append("Description", description);

    const response = await apiService.post<MasterTopicResponse>(`/course/api/master-topics`, formData);
    return response.data;
  },

  update: async (
    id: string,
    domainId: string,
    semesterId: string,
    lecturerIds: string[],
    name: string,
    description: string
  ): Promise<MasterTopicResponse> => {
    const formData = new FormData();
    formData.append("DomainId", domainId);
    formData.append("SemesterId", semesterId);
    lecturerIds.forEach((lecturerId) => formData.append("LecturerIds", lecturerId));
    formData.append("Name", name);
    formData.append("Description", description);

    const response = await apiService.put<MasterTopicResponse>(`/course/api/master-topics/${id}`, formData);
    return response.data;
  },
};
