import { fetchMasterTopic, MasterTopicApiResponse } from "@/lib/api/services/fetchMasterTopic";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useMasterTopics(page = 1, pageSize = 10) {
    const {
        isError,
        isLoading,
        error,
        data,
      } = useQuery({
        queryKey: ["master-topics", page, pageSize],
        queryFn: () => fetchMasterTopic.getAllMasterTopics(page, pageSize),
        select: (data: MasterTopicApiResponse) => ({
          masterTopics: data.data.items,
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
        masterTopics: data?.masterTopics,
        pagination: data?.pagination,
      };
}

export function useMasterTopicById(id?: string) {
    const {
      data,
      isError,
      isLoading,
      error,
    } = useQuery({
      queryKey: ["master-topic", id],
      queryFn: () => (id ? fetchMasterTopic.getMasterTopicById(id) : Promise.reject()),
      enabled: !!id,
    });
    return {
      masterTopic: data,
      isError,
      isLoading,
      error,
    };
  }

  // Create master topic (multipart/form-data)
export function useCreateMasterTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) =>
      fetchMasterTopic.createMasterTopic(formData),
    onSuccess: () => {
      // Refetch danh sách sau khi tạo thành công
      queryClient.invalidateQueries({ queryKey: ["master-topics"] });
    },
  });
}

// Update master topic (multipart/form-data)
export function useUpdateMasterTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      fetchMasterTopic.updateMasterTopic(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["master-topics"] });
      queryClient.invalidateQueries({ queryKey: ["master-topic"] });
    },
  });
}

// Delete master topic
export function useDeleteMasterTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => fetchMasterTopic.deleteMasterTopic(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["master-topics"] });
    },
  });
}
