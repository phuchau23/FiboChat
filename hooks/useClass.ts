import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ClassApiResponse, ClassStudentsResponse, fetchClass, StudentsWithoutClassResponse } from "../lib/api/services/fetchClass";
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


// Hook: lấy danh sách lớp theo lecturerId với pagination
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

// Hook: lấy danh sách sinh viên theo classId
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

export function useStudentsWithoutGroup(classId: string) {
  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["studentsWithoutGroup", classId],
    queryFn: () => fetchClass.getStudentsWithoutGroup(classId),
    enabled: !!classId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    select: (res: ClassStudentsResponse) => res.data, // lấy data từ response
  });

  return {
    studentsData: data, // mảng ClassWithStudents[]
    isLoading,
    isError,
    error,
  };
}

// add Students to Class
export function useAddStudentsToClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classId, userIds }: { classId: string; userIds: string[] }) => fetchClass.addStudentsToClass(classId, userIds),
    onSuccess: (_res, { classId }) => {
      queryClient.invalidateQueries({ queryKey: ["studentsByClass", classId] });
      queryClient.invalidateQueries({ queryKey: ["studentsWithoutClass"] });
    },
  });
}

// get all students from class
export function useStudentsByClassId(classId: string) {
  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["studentsByClass", classId],
    queryFn: () => fetchClass.getStudentsByClassId(classId),
    enabled: !!classId,
    select: (res: ClassStudentsResponse) => res.data 
  });

  return {
    students: data, 
    isLoading,
    isError,
    error,
  };
}

// get all students without class
export function useStudentsWithoutClass(page = 1, pageSize = 10) {
  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["studentsWithoutClass", page, pageSize],
    queryFn: () => fetchClass.getAllStudentsWithoutClass(page, pageSize),
    retry: 1,
     select: (res: StudentsWithoutClassResponse) => ({
      students: res.data.items,
      pagination: res.data,
      statusCode: res.statusCode,
      message: res.message,
    }),
  });

  return {
    studentsData: data?.students,
    pagination: data?.pagination,
    isLoading,
    isError,
    error,
  };
}

// remove Student from Class
export function useRemoveStudentFromClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classId, studentId }: { classId: string; studentId: string }) => fetchClass.removeStudentFromClass(classId, studentId),
    onSuccess: (_res, { classId }) => {
      queryClient.invalidateQueries({ queryKey: ["studentsByClass", classId] });
    },
  });
}


