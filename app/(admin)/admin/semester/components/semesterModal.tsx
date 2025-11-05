/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  FormField,
  FormModal,
} from "@/app/(admin)/admin/components/form-modal";
import { useToast } from "@/hooks/use-toast";
import { useCreateSemester, useUpdateSemester } from "@/hooks/useSemester";
import { Semester } from "@/lib/api/services/fetchSemester";
import { getErrorMessage } from "@/utils/error";

interface SemesterFormModalProps {
  open: boolean;
  selectedSemester: Semester | null;
  onOpenChange: (open: boolean) => void;
}

export function SemesterFormModal({
  open,
  selectedSemester,
  onOpenChange,
}: SemesterFormModalProps) {
  const { toast } = useToast();
  const createSemester = useCreateSemester();
  const updateSemester = useUpdateSemester();

  const handleSubmit = async (formData: Record<string, any>) => {
    const form = new FormData();

    // Convert các field date sang định dạng ISO trước khi append
    form.append("code", formData.code);
    form.append("term", formData.term);
    form.append("year", formData.year);
    if (formData.startDate)
      form.append("startDate", new Date(formData.startDate).toISOString());
    if (formData.endDate)
      form.append("endDate", new Date(formData.endDate).toISOString());

    try {
      if (selectedSemester) {
        // Update
        const res = await updateSemester.mutateAsync({
          id: selectedSemester.id,
          formData: form,
        });

        toast({
          title: "Success notification!",
          description: res?.message || "Semester updated successfully.",
        });
      } else {
        // Create
        const res = await createSemester.mutateAsync(form);

        toast({
          title: "Success notification!",
          description: res?.message || "Semester added successfully.",
        });
      }

      onOpenChange(false);
    } catch (error: any) {
      const message = getErrorMessage(
        error,
        "Failed to save semester. Please try again."
      );

      toast({
        title: "Oops! Something went wrong",
        description: message,
        variant: "destructive",
      });
    }
  };
  const formFields: FormField[] = [
    {
      name: "code",
      label: "Code",
      type: "text",
      required: true,
      placeholder: "e.g., SP2024",
    },
    { name: "year", label: "Year", type: "number", required: true },
    {
      name: "term",
      label: "Term",
      type: "select",
      required: true,
      options: [
        { value: "Spring", label: "Spring" },
        { value: "Summer", label: "Summer" },
        { value: "Fall", label: "Fall" },
      ],
      placeholder: "Select",
    },
    { name: "startDate", label: "Start Date", type: "date", required: true },
    { name: "endDate", label: "End Date", type: "date", required: true },
  ];

  const isLoading = createSemester.isPending || updateSemester.isPending;
  const isError = createSemester.isError || updateSemester.isError;
  const errorMessage =
    (createSemester.error as any)?.message ||
    (updateSemester.error as any)?.message;

  return (
    <FormModal
      open={open}
      title={selectedSemester ? "Edit Semester" : "Add Semester"}
      fields={formFields}
      initialData={selectedSemester || undefined}
      onSubmit={handleSubmit}
      onOpenChange={onOpenChange}
      loading={isLoading}
      error={isError ? errorMessage : "Something went wrong!"}
    />
  );
}
