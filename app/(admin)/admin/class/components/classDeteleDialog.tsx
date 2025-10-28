"use client";

import { ConfirmDialog } from "@/app/(admin)/admin/components/comfirm-dialog";
import { Class } from "@/lib/api/services/fetchClass";
interface ClassDeleteDialogProps {
  open: boolean;
  selectedClass: Class | null;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export function ClassDeleteDialog({
  open,
  selectedClass,
  onConfirm,
  onCancel,
  loading,
}: ClassDeleteDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      title="Delete Class"
      description={`Are you sure you want to delete class ${selectedClass?.code}?`}
      onConfirm={onConfirm}
      onCancel={onCancel}
      loading={loading}
      destructive
    />
  );
}
