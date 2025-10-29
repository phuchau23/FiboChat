"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { fetchSemester, SemesterApiResponse } from "../lib/api/services/fetchSemester";

// Get all semesters
export function useSemesters(page = 1, pageSize = 10) {
  const {
    isError,
    isLoading,
    error,
    data,
  } = useQuery({
    queryKey: ["semesters", page, pageSize],
    queryFn: () => fetchSemester.getAllSemesters(page, pageSize),
    select: (data: SemesterApiResponse) => ({
      semesters: data.data.items,
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
    semesters: data?.semesters,
    pagination: data?.pagination,
  };
}

// Get semester by ID
export function useSemesterById(id?: string) {
  const {
    data,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["semester", id],
    queryFn: () => (id ? fetchSemester.getSemesterById(id) : Promise.reject()),
    enabled: !!id,
  });

  return {
    semester: data,
    isError,
    isLoading,
    error,
  };
}

// Create semester (multipart/form-data)
export function useCreateSemester() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) =>
      fetchSemester.createSemester(formData),
    onSuccess: () => {
      // Refetch danh sách sau khi tạo thành công
      queryClient.invalidateQueries({ queryKey: ["semesters"] });
    },
  });
}

// Update semester (multipart/form-data)
export function useUpdateSemester() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      fetchSemester.updateSemester(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["semesters"] });
    },
  });
}

// Delete semester
export function useDeleteSemester() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => fetchSemester.deleteSemester(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["semesters"] });
    },
  });
}
