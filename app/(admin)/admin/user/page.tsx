"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserTable } from "./components/userTable";
import { UserFormModal } from "./components/userModal";
import { UserDeleteDialog } from "./components/userDeleteDialog";
import { User } from "@/lib/api/services/fetchUser";
import { ImportStudentsModal } from "./components/importStudentsModal";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function UserPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // const handleAdd = () => {
  //   setIsFormOpen(true);
  // };

  // const handleEdit = (user: User) => {
  //   setSelectedUser(user);
  //   setIsFormOpen(true);
  // };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Student Management</h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button className="flex items-center gap-2">Register Student</Button>
          </PopoverTrigger>

          <PopoverContent align="end" className="p-2">
            <div className="flex flex-nowrap border rounded-md overflow-hidden shadow-sm">
              <button
                onClick={() => {
                  setIsFormOpen(true);
                }}
                className="flex flex-1 items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-white hover:bg-primary/90 transition whitespace-nowrap"
              >
                Manually
              </button>

              <button
                onClick={() => {
                  setIsImportOpen(true);
                }}
                className="flex flex-1 items-center gap-2 px-4 py-2 text-sm font-medium hover:bg-muted transition whitespace-nowrap"
              >
                Import from file
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <UserTable onDelete={handleDelete} />

      <UserFormModal open={isFormOpen} onOpenChange={setIsFormOpen} />
      <ImportStudentsModal open={isImportOpen} onOpenChange={setIsImportOpen} />

      <UserDeleteDialog open={isDeleteOpen} selectedUser={selectedUser} onOpenChange={setIsDeleteOpen} />
    </div>
  );
}
