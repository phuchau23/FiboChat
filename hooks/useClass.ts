import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ClassApiResponse, ClassStudentsResponse, fetchClass } from "../lib/api/services/fetchClass";

export default function useClasses(page = 1, pageSize = 10) {
  const { isError, isLoading, error, data } = useQuery({
    queryKey: ["classes", page, pageSize],
    queryFn: () => fetchClass.getAllClasses(page, pageSize),
    select: (data: ClassApiResponse) => ({
      classes: data.data.items,
      pagination: data.data,
      statusCode: data.statusCode,
      message: data.message,
    }),
  });
  return {
    isError,
    isLoading,
    error,
    data,
    classes: data?.classes,
    pagination: data?.pagination,
  };
}

export function useClassById(id?: string) {
  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["class", id],
    queryFn: () => (id ? fetchClass.getClassById(id) : Promise.reject()),
    enabled: !!id,
    select: (res) => res.data,
  });
  return {
    class: data,
    isError,
    isLoading,
    error,
  };
}

export function useCreateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => fetchClass.createClass(formData),
    onSuccess: () => {
      // Refetch danh sách sau khi tạo thành công
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
}

export function useUpdateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => fetchClass.updateClass(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
}

export function useDeleteClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => fetchClass.deleteClass(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
}
// ✅ Hook: lấy danh sách lớp theo lecturerId với pagination
export function useClassesByLecturer(lecturerId: string, page = 1, pageSize = 10) {
  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["classesByLecturer", lecturerId, page, pageSize],
    queryFn: () => fetchClass.getClassesByLecturerId(lecturerId, page, pageSize),
    enabled: !!lecturerId,
    staleTime: 5 * 60 * 1000, // cache 5 phút
    retry: 1,
    select: (res: ClassApiResponse) => ({
      classes: res.data.items,
      pagination: res.data,
      statusCode: res.statusCode,
      message: res.message,
    }),
  });

  return {
    classes: data?.classes,
    pagination: data?.pagination,
    isLoading,
    isError,
    error,
  };
}

// ✅ Hook: lấy danh sách sinh viên theo classId
export function useClassStudents(classId: string) {
  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["classStudents", classId],
    queryFn: () => fetchClass.getStudentsByClassId(classId),
    enabled: !!classId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    select: (res: ClassStudentsResponse) => res.data, // trả về mảng ClassWithStudents[]
  });

  return {
    studentsData: data, // mảng ClassWithStudents[]
    isLoading,
    isError,
    error,
  };
}
