import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchDocument, DocumentApiResponse } from "@/lib/api/services/fetchDocument";

export function useDocumentsAll(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: ["documents", "all", page, pageSize],
    queryFn: () => fetchDocument.getAll(page, pageSize),
    select: (res: DocumentApiResponse) => ({
      documents: res.data.items,
      pagination: res.data,
    }),
  });
}

export function useDocumentsByLecturer(lecturerId: string, page = 1, pageSize = 10) {
  return useQuery({
    queryKey: ["documents", "my", lecturerId, page, pageSize],
    queryFn: () => fetchDocument.getByLecturerId(lecturerId, page, pageSize),
    enabled: !!lecturerId,
    select: (res: DocumentApiResponse) => ({
      documents: res.data.items,
      pagination: res.data,
    }),
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => fetchDocument.upload(formData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["documents"] }),
  });
}

// --- New hooks for detail, update, delete ---
export function useDocument(id: string) {
  return useQuery({
    queryKey: ["document", id],
    queryFn: () => fetchDocument.getById(id),
    enabled: !!id,
    select: (res) => res.data,
  });
}

export function useUpdateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { Title?: string; Version?: number; Status?: string } }) =>
      fetchDocument.update(id, data),
    onSuccess: (data) => queryClient.invalidateQueries({ queryKey: ["documents"] }),
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fetchDocument.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["documents"] }),
  });
}
