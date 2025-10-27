import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTopic, TopicResponse, CreateUpdateResponse } from "@/hooks/services/fetchTopic";

export function useTopics(page = 1, pageSize = 10) {
  const query = useQuery<TopicResponse>({
    queryKey: ["topics", page, pageSize],
    queryFn: () => fetchTopic.getAll(page, pageSize),
    staleTime: 5 * 60 * 1000,
  });

  return {
    ...query,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

// 🟢 Tạo topic mới
export function useCreateTopic() {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    CreateUpdateResponse,
    Error,
    { masterTopicId: string; name: string; description: string }
  >({
    mutationFn: ({ masterTopicId, name, description }) => fetchTopic.create(masterTopicId, name, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topics"] });
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending, // ✅ React Query v5 dùng isPending
    isError: mutation.isError,
  };
}

// 🔵 Cập nhật topic
export function useUpdateTopic() {
  const queryClient = useQueryClient();

  const mutation = useMutation<CreateUpdateResponse, Error, { id: string; name: string; description: string }>({
    mutationFn: ({ id, name, description }) => fetchTopic.update(id, name, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topics"] });
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  };
}
