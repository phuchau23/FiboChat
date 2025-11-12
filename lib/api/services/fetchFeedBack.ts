// lib/api/services/fetchFeedback.ts
import apiService from "@/lib/api/core";

/* ========= Interfaces ========= */
export interface FeedbackUser {
  id: string;
  firstName: string;
  lastName: string;
  studentID: string;
  email: string;
  role: string;
  class: {
    id: string;
    code: string;
    lecturer: {
      id: string;
      fullName: string;
    };
    status: string;
  };
  group: {
    id: string;
    name: string;
  };
}

export interface FeedbackAnswer {
  id: string;
  content: string;
}

export interface FeedbackRecord {
  id: string;
  user: FeedbackUser;
  answer: FeedbackAnswer;
  topic: null | {
    id: string;
    name?: string;
  };
  helpful: string;
  comment: string;
  createdAt: string;
}

export interface FeedbackResponse {
  statusCode: number;
  code: string;
  message: string;
  data: FeedbackRecord;
}

export interface CreateFeedbackRequest {
  AnswerId: string;
  TopicId?: string;
  Helpful: string;
  Comment?: string;
}
export interface FeedbackByLecturerItem {
  id: string;
  user: FeedbackUser;
  answer: FeedbackAnswer;
  topic: {
    id: string;
    name: string;
  } | null;
  helpful: string;
  comment: string;
  createdAt: string;
}

export interface FeedbackByLecturerPagination {
  items: FeedbackByLecturerItem[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface FeedbackByLecturerResponse {
  statusCode: number;
  code: string;
  message: string;
  data: FeedbackByLecturerPagination;
}
/* ========= API service ========= */
export const fetchFeedback = {
  create: async (formData: FormData): Promise<FeedbackResponse> => {
    const res = await apiService.post<FeedbackResponse>("/course/api/feedback", formData);
    return res.data;
  },
  getByLecturer: async (
    lecturerId: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<FeedbackByLecturerResponse> => {
    const res = await apiService.get<FeedbackByLecturerResponse>(
      `/course/api/feedback/lecturer/${lecturerId}?page=${page}&pageSize=${pageSize}`
    );
    return res.data;
  },
  getByTopic: async (topicId: string, page: number = 1, pageSize: number = 10): Promise<FeedbackByLecturerResponse> => {
    const res = await apiService.get<FeedbackByLecturerResponse>(
      `/course/api/feedback/topic/${topicId}?page=${page}&pageSize=${pageSize}`
    );
    return res.data;
  },
};
