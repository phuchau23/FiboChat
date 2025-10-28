import { useQuery } from "@tanstack/react-query";
import { fetchGroups, GroupWithMembers } from "@/lib/api/services/fetchGroup";

// ✅ Hook: lấy nhóm kèm members
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
