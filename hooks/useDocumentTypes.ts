// --- useDocumentTypes.ts ---
import { useQuery, useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { fetchDocumentType, DocumentType, DocumentTypeSingleResponse } from "@/lib/api/services/fetchDocumentType";

export function useDocumentTypes(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: ["document-types", page, pageSize],
    queryFn: () => fetchDocumentType.getAll(page, pageSize),
    select: (res) => ({
      items: res.data.items,
      pagination: res.data,
    }),
  });
}

export function useCreateDocumentType(): UseMutationResult<
  DocumentTypeSingleResponse,
  Error,
  string,
  unknown // context
> {
  const queryClient = useQueryClient();

  return useMutation<DocumentTypeSingleResponse, Error, string>({
    mutationFn: (name: string) => fetchDocumentType.create(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["document-types"] });
    },
  });
}
