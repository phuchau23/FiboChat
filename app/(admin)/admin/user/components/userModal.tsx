/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FormModal, type FormField } from "@/components/common/form-modal";
import { useToast } from "@/hooks/use-toast";
import { useCreateUser } from "@/hooks/useUser";

interface UserFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserFormModal({ open, onOpenChange }: UserFormModalProps) {
  const { toast } = useToast();
  const createUser = useCreateUser();

  // Các field khớp với API RegisterUserRequest
  const formFields: FormField[] = [
    { name: "Email", label: "Email", type: "email", required: true },
    { name: "Firstname", label: "First Name", type: "text", required: true },
    { name: "Lastname", label: "Last Name", type: "text", required: true },
    { name: "StudentID", label: "Student ID", type: "text", required: true },
  ];

  const handleSubmit = async (formData: Record<string, any>) => {
    const form = new FormData();
    form.append("Email", formData.Email);
    form.append("Firstname", formData.Firstname);
    form.append("Lastname", formData.Lastname);
    form.append("StudentID", formData.StudentID);

    try {
      const response = await createUser.mutateAsync(form);

      toast({
        title: "User Created",
        description:
          response.data.message || "Please check your email for verification.",
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Lỗi khi tạo user:", error);
    }
  };

  return (
    <FormModal
      open={open}
      title="Register new student"
      fields={formFields}
      onSubmit={handleSubmit}
      onOpenChange={onOpenChange}
      loading={createUser.isPending}
    />
  );
}
