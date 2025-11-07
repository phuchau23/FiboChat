import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchGroups, GroupWithMembers } from "@/lib/api/services/fetchGroup";

// Get all groups
export function useAllGroups() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["allGroups"],
    queryFn: () => fetchGroups.getAllGroupsAllPages(),
    staleTime: 5 * 60 * 1000, // cache 5m
  });

  return {
    groups: data ?? [],
    isLoading,
    isError,
    error,
  };
}

// Get group with members
export function useClassGroupsWithMembers(classId: string) {
  const query = useQuery<GroupWithMembers[]>({
    queryKey: ["classGroupsWithMembers", classId],
    queryFn: () => fetchGroups.getByClassIdWithMembers(classId),
    enabled: !!classId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  return {
    ...query,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
export function useCreateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { classId: string; name: string; description: string }) =>
      fetchGroups.createGroup(params.classId, params.name, params.description),

    onSuccess: (_, variables) => {
      // Refetch lại danh sách nhóm của lớp vừa tạo
      queryClient.invalidateQueries({
        queryKey: ["classGroupsWithMembers", variables.classId],
      });
    },
  });
}
export function useUpdateGroup(classId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: string; name: string; description: string }) =>
      fetchGroups.updateGroup(params.id, params.name, params.description),

    onSuccess: (_, variables) => {
      // Làm mới danh sách nhóm của lớp
      queryClient.invalidateQueries({
        queryKey: ["classGroupsWithMembers", classId],
      });
    },
  });
}
export function useAddMembersToGroup(classId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { groupId: string; userIds: string[] }) =>
      fetchGroups.addMembersToGroup(params.groupId, params.userIds),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["classGroupsWithMembers", classId],
      });
    },
  });
}
export function useRemoveMemberFromGroup(classId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { groupId: string; userId: string }) =>
      fetchGroups.removeMemberFromGroup(params.groupId, params.userId),

    onSuccess: (_, variables) => {
      // Làm mới danh sách nhóm kèm thành viên của lớp
      queryClient.invalidateQueries({
        queryKey: ["classGroupsWithMembers", classId],
      });
    },
  });
}
export function useDeleteGroup(classId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: string) => fetchGroups.deleteGroup(groupId),

    onMutate: async (groupId: string) => {
      await queryClient.cancelQueries({ queryKey: ["classGroupsWithMembers", classId] });

      const previousData = queryClient.getQueryData<GroupWithMembers[]>(["classGroupsWithMembers", classId]);

      // Cập nhật cache ngay lập tức (ẩn group bị xóa)
      if (previousData) {
        queryClient.setQueryData<GroupWithMembers[]>(
          ["classGroupsWithMembers", classId],
          previousData.filter((g) => g.id !== groupId)
        );
      }

      return { previousData };
    },

    onError: (_err, _variables, context) => {
      // Khôi phục nếu lỗi
      if (context?.previousData) {
        queryClient.setQueryData(["classGroupsWithMembers", classId], context.previousData);
      }
    },

    onSettled: () => {
      // Vẫn refetch để đồng bộ trạng thái với server
      queryClient.invalidateQueries({
        queryKey: ["classGroupsWithMembers", classId],
      });
    },
  });
}
