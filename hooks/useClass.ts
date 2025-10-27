import { ClassApiResponse, fetchClass } from "@/lib/api/services/fetchClass";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function useClasses(page = 1, pageSize = 10) {
    const {
        isError,
        isLoading,
        error,
        data,
      } = useQuery({
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
    const {
      data,
      isError,
      isLoading,
      error,
    } = useQuery({
      queryKey: ["class", id],
      queryFn: () => (id ? fetchClass.getClassById(id) : Promise.reject()),
      enabled: !!id,
      select: (res) => res.data
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
      mutationFn: (formData: FormData) =>
        fetchClass.createClass(formData),
      onSuccess: () => {
        // Refetch danh sách sau khi tạo thành công
        queryClient.invalidateQueries({ queryKey: ["classes"] });
      },
    });
  }

  export function useUpdateClass() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
        fetchClass.updateClass(id, formData),
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
