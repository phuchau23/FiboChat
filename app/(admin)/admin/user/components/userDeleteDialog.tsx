"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteUser } from "@/hooks/useUser";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@/lib/api/services/fetchUser";
import { useState } from "react";
import { getErrorMessage } from "@/utils/error";

interface UserDeleteDialogProps {
  open: boolean;
  selectedUser: User | null;
  onOpenChange: (open: boolean) => void;
}

export function UserDeleteDialog({
  open,
  selectedUser,
  onOpenChange,
}: UserDeleteDialogProps) {
  const { toast } = useToast();
  const deleteUser = useDeleteUser();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!selectedUser) return;
    setLoading(true);
    try {
      const res = await deleteUser.mutateAsync(selectedUser.id);

      toast({
        title: "Success notification!",
        description: res?.message || "Student deleted successfully.",
      });

      onOpenChange(false);
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Failed to delete student. Please try again."
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

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-bold">
            Delete Student
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold">
              {selectedUser
                ? `${selectedUser.firstname} ${selectedUser.lastname}`
                : "this user"}
            </span>
            ?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex justify-end gap-3 mt-4">
          <AlertDialogCancel
            disabled={loading}
            onClick={() => onOpenChange(false)}
            className="hover:border-gray-400"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
