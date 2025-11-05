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
import { useRemoveStudentFromClass } from "@/hooks/useClass";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/utils/error";

interface RemoveStudentDialogProps {
  open: boolean;
  classId: string;
  selectedStudent: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
  onOpenChange: (open: boolean) => void;
}

export function RemoveStudentDialog({
  open,
  classId,
  selectedStudent,
  onOpenChange,
}: RemoveStudentDialogProps) {
  const { toast } = useToast();
  const removeStudentMutation = useRemoveStudentFromClass();

  const handleConfirm = async () => {
    if (!selectedStudent) return;

    removeStudentMutation.mutate(
      { classId, studentId: selectedStudent.id },
      {
        onSuccess: () => {
          toast({
            title: "Removed Successfully",
            description: `${selectedStudent.firstName} ${selectedStudent.lastName} has been removed from this class.`,
          });
          onOpenChange(false);
        },
        onError: (err: unknown) => {
          const message = getErrorMessage(
            err,
            "Failed to remove student. Please try again."
          );

          toast({
            title: "Oops! Something went wrong",
            description: message,
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Student</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove{" "}
            <span className="font-semibold">
              {selectedStudent?.firstName} {selectedStudent?.lastName}
            </span>{" "}
            from this class?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex gap-3 justify-end">
          <AlertDialogCancel disabled={removeStudentMutation.isPending}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction onClick={handleConfirm}>Remove</AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
