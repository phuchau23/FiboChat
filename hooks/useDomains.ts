import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DomainResponse, fetchDomain, BaseApiResponse } from "@/hooks/services/fetchDomains";

// ✅ Hook: Lấy danh sách domain
export function useDomains(page = 1, pageSize = 10) {
  const query = useQuery<DomainResponse>({
    queryKey: ["domains", page, pageSize],
    queryFn: () => fetchDomain.getAll(page, pageSize),
    staleTime: 5 * 60 * 1000, // cache 5 phút
    retry: 1,
  });

  // Trả thêm trạng thái loading & error để dùng UI sau này
  return {
    ...query,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

// ✅ Hook: Tạo mới domain
export function useCreateDomain() {
  const queryClient = useQueryClient();

  const mutation = useMutation<BaseApiResponse, Error, { name: string; description: string }>({
    mutationFn: ({ name, description }) => fetchDomain.create(name, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["domains"] });
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  };
}

// ✅ Hook: Cập nhật domain
export function useUpdateDomain() {
  const queryClient = useQueryClient();

  const mutation = useMutation<BaseApiResponse, Error, { id: string; name: string; description: string }>({
    mutationFn: ({ id, name, description }) => fetchDomain.update(id, name, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["domains"] });
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  };
}
