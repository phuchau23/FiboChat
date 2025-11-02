// hooks/useDocuments.ts
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}
