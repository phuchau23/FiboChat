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

/* ========= API service ========= */
export const fetchFeedback = {
  create: async (formData: FormData): Promise<FeedbackResponse> => {
    const res = await apiService.post<FeedbackResponse>("/course/api/feedback", formData);
    return res.data;
  },
};
