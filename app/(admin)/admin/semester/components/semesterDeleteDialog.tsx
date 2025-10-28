"use client";

import { ConfirmDialog } from "@/app/(admin)/admin/components/comfirm-dialog";
import { Semester } from "@/lib/api/services/fetchSemester";

interface SemesterDeleteDialogProps {
  open: boolean;
  selectedSemester: Semester | null;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export function SemesterDeleteDialog({
  open,
  selectedSemester,
  onConfirm,
  onCancel,
  loading,
}: SemesterDeleteDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      title="Delete Semester"
      description={
        selectedSemester
          ? `Are you sure you want to delete ${selectedSemester.code}?`
          : "Are you sure you want to delete this semester?"
      }
      onConfirm={onConfirm}
      onCancel={onCancel}
      loading={loading}
      destructive
    />
  );
}
