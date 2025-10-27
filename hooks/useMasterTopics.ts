import { fetchMasterTopic, MasterTopicResponse } from "@/hooks/services/fetchMasterTopics";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ✅ Hook: Get All Master Topics
export function useMasterTopics(page = 1, pageSize = 10) {
  const query = useQuery<MasterTopicResponse>({
    queryKey: ["masterTopics", page, pageSize],
    queryFn: () => fetchMasterTopic.getAll(page, pageSize),
    staleTime: 5 * 60 * 1000, // cache 5 phút
    retry: 1,
  });

  // ✅ Trả về thêm loading + error cho dễ xử lý UI sau này
  return {
    ...query,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

// ✅ Hook: Create Master Topic
export function useCreateMasterTopic() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (params: {
      domainId: string;
      semesterId: string;
      lecturerIds: string[];
      name: string;
      description: string;
    }) =>
      fetchMasterTopic.create(params.domainId, params.semesterId, params.lecturerIds, params.name, params.description),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["masterTopics"] }),
  });

  // ✅ Trả về thêm loading + error
  return {
    ...mutation,
    isLoading: mutation.isPending, // react-query v5: mutation dùng isPending
    isError: mutation.isError,
  };
}

// ✅ Hook: Update Master Topic
export function useUpdateMasterTopic() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (params: {
      id: string;
      domainId: string;
      semesterId: string;
      lecturerIds: string[];
      name: string;
      description: string;
    }) =>
      fetchMasterTopic.update(
        params.id,
        params.domainId,
        params.semesterId,
        params.lecturerIds,
        params.name,
        params.description
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["masterTopics"] }),
  });

  // ✅ Trả về thêm loading + error
  return {
    ...mutation,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  };
}
