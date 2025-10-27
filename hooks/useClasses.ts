import { useQuery } from "@tanstack/react-query";
import { fetchClasses, ClassResponse, ClassStudentsResponse } from "@/hooks/services/fetchClasses";

// ✅ Hook: lấy danh sách lớp theo lecturerId
export function useClasses(lecturerId: string, page = 1, pageSize = 10) {
  const query = useQuery<ClassResponse>({
    queryKey: ["classes", lecturerId, page, pageSize],
    queryFn: () => fetchClasses.getAllByLecturer(lecturerId, page, pageSize),
    enabled: !!lecturerId,
    staleTime: 5 * 60 * 1000, // cache 5 phút
    retry: 1,
  });

  return {
    ...query,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

// ✅ Hook: lấy danh sách sinh viên theo classId
export function useClassStudents(classId: string) {
  const query = useQuery<ClassStudentsResponse>({
    queryKey: ["classStudents", classId],
    queryFn: () => fetchClasses.getStudentsByClassId(classId),
    enabled: !!classId, // chỉ gọi khi có classId
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  return {
    ...query,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
