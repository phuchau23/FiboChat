import { fetchUser, UserApiResponse } from "@/lib/api/services/fetchUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useUser(page = 1, pageSize = 10) {
    const { data, isLoading, isError, error } = useQuery({
      queryKey: ["users", page, pageSize],
      queryFn: () => fetchUser.getAllUsers(page, pageSize),
      select: (data: UserApiResponse) => ({
        users: data.data.items,
        pagination: data.data,
        statusCode: data.statusCode,
        message: data.message,
      }),
    });
    return {
      data,
      isLoading,
      isError,
      error,
      users: data?.users,
      pagination: data?.pagination,
    };
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => fetchUser.createUser(formData),
    onSuccess: () => {
      // Refetch danh sách sau khi tạo thành công
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => fetchUser.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
