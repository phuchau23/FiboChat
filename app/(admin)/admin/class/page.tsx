"use client";

import { useState } from "react";
import { useDeleteClass } from "@/hooks/useClass";
import { Button } from "@/components/ui/button";
import { ClassTable } from "./components/classTable";
import { ClassFormModal } from "./components/classModal";
import type { Class } from "@/lib/api/services/fetchClass";
import { ClassDeleteDialog } from "./components/classDeteleDialog";

export default function ClassPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  const deleteClass = useDeleteClass();

  const handleAdd = () => {
    setSelectedClass(null);
    setIsFormOpen(true);
  };

  const handleEdit = (classItem: Class) => {
    setSelectedClass(classItem);
    setIsFormOpen(true);
  };

  const handleDelete = (classItem: Class) => {
    setSelectedClass(classItem);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedClass) return;
    try {
      await deleteClass.mutateAsync(selectedClass.id);
      setIsDeleteOpen(false);
    } catch (error) {
      console.error("Error deleting class:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Class Management</h1>
        <Button onClick={handleAdd}>Add Class</Button>
      </div>

      {/* Table */}
      <ClassTable onEdit={handleEdit} onDelete={handleDelete} />

      {/* Form Modal */}
      <ClassFormModal
        open={isFormOpen}
        selectedClass={selectedClass}
        onOpenChange={setIsFormOpen}
      />

      {/* Delete Dialog */}
      <ClassDeleteDialog
        open={isDeleteOpen}
        selectedClass={selectedClass}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
        loading={deleteClass.isPending}
      />
    </div>
  );
}
