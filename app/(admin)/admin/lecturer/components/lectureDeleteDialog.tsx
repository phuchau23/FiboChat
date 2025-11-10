/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Lecturer } from "@/lib/api/services/fetchLecturer";
import { useDeleteLecturer } from "@/hooks/useLecturer";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/utils/error";

interface LecturerDeleteDialogProps {
  open: boolean;
  selectedLecturer: Lecturer | null;
  onOpenChange: (open: boolean) => void;
}

export function LecturerDeleteDialog({
  open,
  selectedLecturer,
  onOpenChange,
}: LecturerDeleteDialogProps) {
  const { toast } = useToast();
  const deleteLecturer = useDeleteLecturer();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!selectedLecturer) return;
    setLoading(true);
    try {
      await deleteLecturer.mutateAsync(selectedLecturer.lecturerId);

      toast({
        title: "Success notification!",
        description: "Lecturer deleted successfully.",
      });

      onOpenChange(false);
    } catch (error: any) {
      const message = getErrorMessage(
        error,
        "Failed to delete lecturer. Please try again."
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
            Delete Lecturer
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete lecturer{" "}
            <span className="font-semibold">{selectedLecturer?.fullName}</span>{" "}
            ?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex justify-end gap-3">
          <AlertDialogCancel
            disabled={loading}
            onClick={() => onOpenChange(false)}
            className=" hover:border-gray-400"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
