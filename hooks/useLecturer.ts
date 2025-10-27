import { useQuery } from "@tanstack/react-query";
import { fetchLecturer, LecturerResponse, LecturerDetailResponse } from "@/hooks/services/fetchLecturers";

// ✅ Hook: Lấy tất cả giảng viên
export function useLecturers() {
  const query = useQuery<LecturerResponse>({
    queryKey: ["lecturers"],
    queryFn: fetchLecturer.getAll,
    staleTime: 5 * 60 * 1000, // cache 5 phút
    retry: 1, // thử lại 1 lần nếu lỗi
  });

  // ✅ Trả thêm trạng thái để tiện gắn skeleton / UI lỗi
  return {
    ...query,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

// ✅ Hook: Lấy giảng viên theo ID
export function useLecturerById(id: string) {
  const query = useQuery<LecturerDetailResponse>({
    queryKey: ["lecturer", id],
    queryFn: () => fetchLecturer.getById(id),
    enabled: !!id, // chỉ gọi khi id có giá trị
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // ✅ Trả thêm trạng thái để tiện UI sau này
  return {
    ...query,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
