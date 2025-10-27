"use client"

import { ConfirmDialog } from "@/components/common/comfirm-dialog"
import type { User } from "@/mock/users"

interface UserDeleteDialogProps {
  open: boolean
  selectedUser: User | null
  onConfirm: () => Promise<void>
  onCancel: () => void
  loading: boolean
}

export function UserDeleteDialog({ open, selectedUser, onConfirm, onCancel, loading }: UserDeleteDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      title="Delete User"
      description={`Are you sure you want to delete user ${selectedUser?.FullName}? This action cannot be undone.`}
      onConfirm={onConfirm}
      onCancel={onCancel}
      loading={loading}
      destructive
    />
  )
}
