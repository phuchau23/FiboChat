import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTopic, TopicApiResponse } from "../lib/api/services/fetchTopic";
import { getCookie } from "cookies-next";

export function useTopics(page = 1, pageSize = 10) {
  const { isError, isLoading, error, data } = useQuery({
    queryKey: ["topics", page, pageSize],
    queryFn: () => fetchTopic.getAllTopics(page, pageSize),
    select: (data: TopicApiResponse) => ({
      topics: data.data.items,
      pagination: data.data,
      statusCode: data.statusCode,
      message: data.message,
    }),
  });
  return {
    isError,
    isLoading,
    error,
    data,
    topics: data?.topics,
    pagination: data?.pagination,
  };
}

export function useAllTopics() {
  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["allTopics"],
    queryFn: () => fetchTopic.getAllTopicsAllPages(),
    staleTime: 15 * 60 * 1000, // 15 phút không fetch lại
    refetchOnWindowFocus: false,
  });

  return {
    topics: data ?? [],
    isLoading,
    isError,
    error,
  };
}

export function useTopicById(id?: string) {
  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["topic", id],
    queryFn: () => (id ? fetchTopic.getTopicById(id) : Promise.reject()),
    enabled: !!id,
  });
  return {
    topic: data,
    isError,
    isLoading,
    error,
  };
}

export function useCreateTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => fetchTopic.createTopic(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topics"] });
    },
  });
}

export function useUpdateTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => fetchTopic.updateTopic(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topics"] });
      queryClient.invalidateQueries({ queryKey: ["topic"] });
    },
  });
}

export function useDeleteTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => fetchTopic.deleteTopic(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topics"] });
    },
  });
}
export function useTopicsByLecturer(lecturerId?: string, page = 1, pageSize = 100) {
  const id = lecturerId ?? (getCookie("user-id") as string);

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["topicsByLecturer", id, page, pageSize],
    queryFn: () => fetchTopic.getTopicsByLecturer(id, page, pageSize),
    enabled: !!id,
    select: (data: TopicApiResponse) => ({
      topics: data.data.items,
      pagination: data.data,
      statusCode: data.statusCode,
      message: data.message,
    }),
  });

  return {
    isError,
    isLoading,
    error,
    data,
    topics: data?.topics ?? [], // luôn trả về array để component an toàn
    pagination: data?.pagination,
  };
}
