"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserTable } from "./components/userTable";
import { UserFormModal } from "./components/userModal";
import { UserDeleteDialog } from "./components/userDeleteDialog";
import { User } from "@/lib/api/services/fetchUser";

export default function UserPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleAdd = () => {
    setIsFormOpen(true);
  };

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
        <Button onClick={handleAdd}>Add Student</Button>
      </div>

      <UserTable onDelete={handleDelete} />

      <UserFormModal open={isFormOpen} onOpenChange={setIsFormOpen} />

      <UserDeleteDialog
        open={isDeleteOpen}
        selectedUser={selectedUser}
        onOpenChange={setIsDeleteOpen}
      />
    </div>
  );
}
