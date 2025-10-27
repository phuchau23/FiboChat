import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchUser,
  UpdateProfilePayload,
  UpdateProfileResponse,
  UserProfileResponse,
} from "@/hooks/services/fetchUser";

export function useUserProfile() {
  const query = useQuery<UserProfileResponse>({
    queryKey: ["userProfile"],
    queryFn: fetchUser.getProfile,
    staleTime: 5 * 60 * 1000, // cache 5 phút
    retry: 1,
  });

  // ✅ Giữ nguyên logic, chỉ thêm flag để tiện dùng
  return {
    ...query,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    UpdateProfileResponse,
    Error, // ✅ không dùng any, rõ kiểu lỗi
    UpdateProfilePayload
  >({
    mutationFn: fetchUser.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  };
}
