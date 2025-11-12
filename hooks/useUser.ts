import {
  fetchUser,
  UpdateProfilePayload,
  UpdateProfileResponse,
  UserApiResponse,
  UserProfileResponse,
} from "@/lib/api/services/fetchUser";
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

export function useAllUsers() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["allUsers"],
    queryFn: () => fetchUser.getAllUsersNoPagination(),
    staleTime: 5 * 60 * 1000, // cache 5 phút
  });

  return {
    users: data ?? [],
    isLoading,
    isError,
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
export function useUserProfile() {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: (): Promise<UserProfileResponse> => fetchUser.getUserProfile(),
    select: (data) => data, // có thể bỏ qua nếu không cần format
  });
}
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload): Promise<UpdateProfileResponse> => fetchUser.updateUserProfile(payload),
    onSuccess: () => {
      // Sau khi cập nhật xong thì refetch lại hồ sơ
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export function useImportUsers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => fetchUser.importUsers(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
