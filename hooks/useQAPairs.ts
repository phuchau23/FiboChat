// hooks/useQAPairs.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchQAPair, QAApiResponse } from "@/lib/api/services/fetchQAPair";

export function useQAPairs(
  filters: {
    topicId?: string;
    documentId?: string;
    status?: string;
    keyword?: string;
    page?: number;
    pageSize?: number;
  } = {}
) {
  return useQuery({
    queryKey: ["qa-pairs", filters],
    queryFn: () => fetchQAPair.getAll(filters),
    select: (res: QAApiResponse) => ({
      qaPairs: res.data.items,
      pagination: res.data,
    }),
  });
}

export function useCreateQAPair() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => fetchQAPair.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qa-pairs"] });
    },
  });
}
