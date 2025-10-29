import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchLecturer, LecturerApiResponse } from "../lib/api/services/fetchLecturer";

export default function useLecturers() {
    const {isError, isLoading, error, data} = useQuery({
      queryKey: ["lecturers"],
      queryFn: () => fetchLecturer.getAllLecturers(),
      select: (data: LecturerApiResponse) => ({
        lecturers: data.data,
        statusCode: data.statusCode,
        message: data.message,
      })
    });
    return {
      isError,
      isLoading,
      error,
      data,
      lecturers: data?.lecturers,
    };
  }

  export function useLecturerById(id?: string) {
      const {
        data,
        isError,
        isLoading,
        error,
      } = useQuery({
        queryKey: ["lecturer", id],
        queryFn: () => (id ? fetchLecturer.getLecturerById(id) : Promise.reject()),
        enabled: !!id,
        select: (res) => res.data,
      });

      return {
        lecturer: data,
        isError,
        isLoading,
        error,
      };
    }
    
    export function useCreateLecturer() {
      const queryClient = useQueryClient();

      return useMutation({
        mutationFn: (formData: FormData) =>
          fetchLecturer.createLecturer(formData),
        onSuccess: () => {
          // Refetch danh sách sau khi tạo thành công
          queryClient.invalidateQueries({ queryKey: ["lecturers"] });
        },
      });
    }

    export function useUpdateLecturer() {
      const queryClient = useQueryClient();

      return useMutation({
        mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
          fetchLecturer.updateLecturer(id, formData),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["lecturers"] });
        },
      });
    }

    export function useDeleteLecturer() {
      const queryClient = useQueryClient();

      return useMutation({
        mutationFn: (id: string) => fetchLecturer.deleteLecturer(id),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["lecturers"] });
        },
      });
    }

