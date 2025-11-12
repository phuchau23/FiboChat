"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserTable } from "./components/userTable";
import { UserFormModal } from "./components/userModal";
import { UserDeleteDialog } from "./components/userDeleteDialog";
import { ImportStudentsModal } from "./components/importStudentsModal";
import { ImportJobTracker } from "./components/importJobTracker";
import { User } from "@/lib/api/services/fetchUser";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function UserPage() {
  // --- Modal states ---
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // --- Selected user (for delete) ---
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // --- Import tracking ---
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  // --- Delete handler ---
  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  // --- Job started callback ---
  const handleJobStarted = (jobId: string) => {
    setActiveJobId(jobId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Student Management</h1>

        <Popover>
          <PopoverTrigger asChild>
            <Button className="flex items-center gap-2">
              Register Student
            </Button>
          </PopoverTrigger>

          <PopoverContent align="end" className="p-2">
            <div className="flex flex-nowrap border rounded-md overflow-hidden shadow-sm">
              {/* Thêm thủ công */}
              <button
                onClick={() => setIsFormOpen(true)}
                className="flex flex-1 items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-white hover:bg-primary/90 transition whitespace-nowrap"
              >
                Manually
              </button>

              {/* Import từ file */}
              <button
                onClick={() => setIsImportOpen(true)}
                className="flex flex-1 items-center gap-2 px-4 py-2 text-sm font-medium hover:bg-muted transition whitespace-nowrap"
              >
                Import from file
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Table hiển thị danh sách user */}
      <UserTable onDelete={handleDelete} />

      {/* Modal thêm mới */}
      <UserFormModal open={isFormOpen} onOpenChange={setIsFormOpen} />

      {/* Modal import file */}
      <ImportStudentsModal
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
        // 👇 Truyền callback để nhận importJobId từ modal
        onJobStarted={handleJobStarted}
      />

      {/* Modal xác nhận xóa */}
      <UserDeleteDialog
        open={isDeleteOpen}
        selectedUser={selectedUser}
        onOpenChange={setIsDeleteOpen}
      />

      {/* Tracker chạy nền, toast hiển thị real-time */}
      {activeJobId && <ImportJobTracker jobId={activeJobId} />}
    </div>
  );
}
