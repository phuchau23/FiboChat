// hooks/useQAPairs.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchQAPair, QAApiResponse, QAPairsByLecturerParams } from "@/lib/api/services/fetchQAPair";

// === Existing hooks ===
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

export function useQAPairsByLecturer(lecturerId: string, options: QAPairsByLecturerParams = {}) {
  return useQuery({
    queryKey: ["qa-pairs-lecturer", lecturerId, options],
    queryFn: () => fetchQAPair.getByLecturer(lecturerId, options),
    select: (res: QAApiResponse) => ({
      qaPairs: res.data.items,
      pagination: res.data,
    }),
    enabled: !!lecturerId,
  });
}

// === New hook: update QA pair ===
export function useUpdateQAPair() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => fetchQAPair.update(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qa-pairs"] });
    },
  });
}

// === New hook: delete QA pair ===
export function useDeleteQAPair() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fetchQAPair.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qa-pairs"] });
    },
  });
}
