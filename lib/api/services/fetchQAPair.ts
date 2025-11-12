// lib/api/services/fetchQAPair.ts
import apiService from "@/lib/api/core";

// === Interfaces ===
export interface QAPair {
  id: string;
  topicId: string;
  documentId: string | null;
  createdById: string;
  verifiedById: string | null;
  questionText: string;
  answerText: string;
  status: "Active" | "Inactive";
  createdAt: string;
  updatedAt: string;
}

export interface QAPairsByLecturerParams {
  page?: number;
  pageSize?: number;
  topicId?: string;
}

export interface QAPagination {
  items: QAPair[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface QAApiResponse {
  statusCode: number;
  code: string;
  message: string;
  data: QAPagination;
}

export interface QASingleResponse {
  statusCode: number;
  code: string;
  message: string;
  data: QAPair;
}

export interface CreateQAPairRequest {
  TopicId: string;
  DocumentId: string | null;
  QuestionText: string;
  AnswerText: string;
}

// === fetchQAPair ===
export const fetchQAPair = {
  getAll: async (
    params: {
      topicId?: string;
      documentId?: string;
      status?: string;
      keyword?: string;
      page?: number;
      pageSize?: number;
    } = {}
  ): Promise<QAApiResponse> => {
    const query = new URLSearchParams();
    if (params.topicId) query.append("topicId", params.topicId);
    if (params.documentId) query.append("documentId", params.documentId);
    if (params.status) query.append("status", params.status);
    if (params.keyword) query.append("keyword", params.keyword);
    if (params.page) query.append("page", params.page.toString());
    if (params.pageSize) query.append("pageSize", params.pageSize.toString());

    const res = await apiService.get<QAApiResponse>(`/course/api/qa-pairs?${query.toString()}`);
    return res.data;
  },

  create: async (formData: FormData): Promise<QASingleResponse> => {
    // Thêm 2 trường auto
    formData.append("AutoEmbed", "true");
    formData.append("AutoLoadCache", "true");

    const res = await apiService.post<QASingleResponse>("/course/api/qa-pairs", formData);
    return res.data;
  },

  getByLecturer: async (lecturerId: string, params: QAPairsByLecturerParams = {}): Promise<QAApiResponse> => {
    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page.toString());
    if (params.pageSize) query.append("pageSize", params.pageSize.toString());
    if (params.topicId) query.append("topicId", params.topicId);

    const res = await apiService.get<QAApiResponse>(`/course/api/qa-pairs/lecturer/${lecturerId}?${query.toString()}`);
    return res.data;
  },

  // === New API: update QA pair ===
  update: async (id: string, formData: FormData): Promise<QASingleResponse> => {
    const res = await apiService.put<QASingleResponse>(`/course/api/qa-pairs/${id}`, formData);
    return res.data;
  },

  // === New API: delete QA pair ===
  delete: async (id: string): Promise<QASingleResponse> => {
    const res = await apiService.delete<QASingleResponse>(`/course/api/qa-pairs/${id}`);
    return res.data;
  },
};
