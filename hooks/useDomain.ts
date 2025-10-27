import { DomainApiResponse, fetchDomain } from "@/lib/api/services/fetchDomain";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useDomains(page = 1, pageSize = 10) {
    const {
        isError,
        isLoading,
        error,
        data,
      } = useQuery({
        queryKey: ["domains", page, pageSize],
        queryFn: () => fetchDomain.getAllDomains(page, pageSize),
        select: (data: DomainApiResponse) => ({
          domains: data.data.items,
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
        domains: data?.domains,
        pagination: data?.pagination,
      };
}

export function useDomainById(id?: string) {
    const {
      data,
      isError,
      isLoading,
      error,
    } = useQuery({
      queryKey: ["domain", id],
      queryFn: () => (id ? fetchDomain.getDomainById(id) : Promise.reject()),
      enabled: !!id,
      
    });
    return {
      domain: data,
      isError,
      isLoading,
      error,
    };
  }

  // Create domain (multipart/form-data)
export function useCreateDomain() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) =>
      fetchDomain.createDomain(formData),
    onSuccess: () => {
      // Refetch danh sách sau khi tạo thành công
      queryClient.invalidateQueries({ queryKey: ["domains"] });
    },
  });
}

// Update domain (multipart/form-data)
export function useUpdateDomain() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      fetchDomain.updateDomain(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["domains"] });
    },
  });
}

// Delete domain
export function useDeleteDomain() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => fetchDomain.deleteDomain(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["domains"] });
    },
  });
}


    
