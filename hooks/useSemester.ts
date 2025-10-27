import { useQuery } from "@tanstack/react-query";
import { fetchSemester, SemesterResponse } from "@/hooks/services/fetchSemesters";

export function useSemesters(page = 1, pageSize = 10) {
  const query = useQuery<SemesterResponse>({
    queryKey: ["semesters", page, pageSize],
    queryFn: () => fetchSemester.getAll(page, pageSize),
    staleTime: 5 * 60 * 1000, // cache 5 phút
    retry: 1, // thử lại 1 lần nếu lỗi
  });

  // ✅ Trả về thêm isLoading, isError để tiện dùng Skeleton/Error UI
  return {
    ...query,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
