// hooks/useFeedback.ts
import { FeedbackByLecturerResponse, FeedbackResponse, fetchFeedback } from "@/lib/api/services/fetchFeedBack";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { useState, useCallback } from "react";

interface CreateFeedbackPayload {
  AnswerId: string;
  TopicId?: string;
  Helpful: string;
  Comment?: string;
}

export function useFeedback() {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<FeedbackResponse | null>(null);

  const createFeedback = useCallback(async (payload: CreateFeedbackPayload) => {
    setLoading(true);
    setError(null);

    try {
      const form = new FormData();
      form.append("AnswerId", payload.AnswerId);
      if (payload.TopicId) form.append("TopicId", payload.TopicId);
      form.append("Helpful", payload.Helpful);
      if (payload.Comment) form.append("Comment", payload.Comment);

      const data = await fetchFeedback.create(form);
      setResponse(data);
      return data;
    } catch (err: unknown) {
      console.error("Feedback error:", err);

      // Type guard
      if (err instanceof Error) {
        setError(err.message);
        throw err;
      } else {
        setError("Unexpected error occurred");
        throw new Error("Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { createFeedback, isLoading, error, response };
}
// hooks/useFeedback.ts
export function useFeedbackByLecturer(
  lecturerId?: string,
  page: number = 1,
  pageSize: number = 10,
  options?: UseQueryOptions<FeedbackByLecturerResponse>
) {
  return useQuery<FeedbackByLecturerResponse>({
    queryKey: ["feedbackByLecturer", lecturerId, page, pageSize],
    queryFn: async () => {
      if (!lecturerId) throw new Error("Lecturer ID not found");
      return await fetchFeedback.getByLecturer(lecturerId, page, pageSize);
    },
    enabled: !!lecturerId, // Chỉ fetch khi có lecturerId
    ...options,
  });
}

// Lấy feedback theo topicId
export function useFeedbackByTopic(topicId?: string, page: number = 1, pageSize: number = 10) {
  return useQuery<FeedbackByLecturerResponse>({
    queryKey: ["feedbackByTopic", topicId, page, pageSize],
    queryFn: async () => {
      if (!topicId) throw new Error("Topic ID not provided");
      return await fetchFeedback.getByTopic(topicId, page, pageSize);
    },
    enabled: !!topicId,
  });
}
