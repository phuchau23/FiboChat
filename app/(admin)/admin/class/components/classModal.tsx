/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  FormModal,
  type FormField,
} from "@/app/(admin)/admin/components/form-modal";
import { useToast } from "@/hooks/use-toast";
import { useCreateClass, useUpdateClass } from "@/hooks/useClass";
import useLecturers from "@/hooks/useLecturer";
import { useSemesters } from "@/hooks/useSemester";
import type { Class } from "@/lib/api/services/fetchClass";
import { Lecturer } from "@/lib/api/services/fetchLecturer";
import { getErrorMessage } from "@/utils/error";
import { useEffect, useMemo, useState } from "react";

interface ClassFormModalProps {
  open: boolean;
  selectedClass: Class | null;
  onOpenChange: (open: boolean) => void;
}

export function ClassFormModal({
  open,
  selectedClass,
  onOpenChange,
}: ClassFormModalProps) {
  // fetch dropdown data bên trong modal
  const { semesters, isLoading: loadingSemesters } = useSemesters();
  const { lecturers, isLoading: loadingLecturers } = useLecturers();

  const { toast } = useToast();
  const createClass = useCreateClass();
  const updateClass = useUpdateClass();
  const [loading, setLoading] = useState(false);

  const semesterOptions = useMemo(
    () =>
      (semesters ?? []).map((s) => ({
        value: s.id,
        label: `${s.code}`,
      })),
    [semesters]
  );

  const lecturerOptions = useMemo(
    () =>
      (lecturers ?? []).map((l: Lecturer) => ({
        value: l.lecturerId,
        label: l.fullName,
      })),
    [lecturers]
  );

  const formFields: FormField[] = [
    {
      name: "Code",
      label: "Class Code",
      type: "text",
      required: true,
      placeholder: "e.g., SE1834",
    },
    {
      name: "SemesterId",
      label: "Semester",
      type: "select",
      required: true,
      options: semesterOptions,
      placeholder: "Select semester",
    },
    {
      name: "LecturerId",
      label: "Lecturer",
      type: "select",
      required: true,
      options: lecturerOptions,
      placeholder: "Select lecturer",
    },
  ];

  const initialData = selectedClass
    ? {
        Code: selectedClass.code,
        SemesterId: selectedClass.semester?.id,
        LecturerId: selectedClass.lecturer?.id,
      }
    : undefined;

  const handleSubmit = async (formData: Record<string, any>) => {
    const form = new FormData();
    form.append("Code", formData.Code);
    form.append("SemesterId", formData.SemesterId);
    form.append("LecturerId", formData.LecturerId);

    try {
      setLoading(true);

      if (selectedClass) {
        // Update class
        const res = await updateClass.mutateAsync({
          id: selectedClass.id,
          formData: form,
        });

        toast({
          description: res.message || "Class updated successfully.",
        });
      } else {
        // Create class
        const res = await createClass.mutateAsync(form);

        toast({
          title: "Success notification!",
          description: res.message || "Class created successfully.",
        });
      }

      onOpenChange(false);
    } catch (err: any) {
      const message = getErrorMessage(
        err,
        "Failed to save class. Please try again."
      );

      toast({
        title: "Oops! Something went wrong",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) setLoading(false);
  }, [open]);

  // Nếu dropdown đang tải, cứ để FormModal hiện, user thấy select placeholder
  return (
    <FormModal
      open={open}
      title={selectedClass ? "Edit Class" : "Add Class"}
      fields={formFields}
      initialData={initialData}
      onSubmit={handleSubmit}
      onOpenChange={onOpenChange}
      loading={
        loading ||
        createClass.isPending ||
        updateClass.isPending ||
        loadingSemesters ||
        loadingLecturers
      }
    />
  );
}
