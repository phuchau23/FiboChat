import {
  ClassEnrollmentResponse,
  ClassEnrollmentsResponse,
  fetchClassEnrollment,
} from "@/lib/api/services/fetchGroupEnrollment";
import { useQuery } from "@tanstack/react-query";

// 🧩 Lấy thông tin ghi danh (class + group của user)
export function useClassEnrollmentByUser(userId?: string) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["classEnrollment", userId],
    queryFn: () => (userId ? fetchClassEnrollment.getByUser(userId) : Promise.reject("Missing userId")),
    enabled: !!userId,
    select: (res: ClassEnrollmentResponse) => res.data,
  });

  return { data, isLoading, isError, error };
}

// 🧩 Lấy danh sách thành viên trong group
export function useGroupMembers(groupId?: string, page = 1, pageSize = 10) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["groupMembers", groupId, page],
    queryFn: () =>
      groupId ? fetchClassEnrollment.getByGroup(groupId, page, pageSize) : Promise.reject("Missing groupId"),
    enabled: !!groupId,
    select: (res: ClassEnrollmentsResponse) => ({
      members: res.data.items.map((m) => ({
        id: m.user.id,
        name: `${m.user.lastName} ${m.user.firstName}`.trim(),
        studentID: m.user.studentID,
        email: m.user.email,
        role: m.roleInClass,
      })),
    }),
  });

  return { data, isLoading, isError, error, members: data?.members };
}
