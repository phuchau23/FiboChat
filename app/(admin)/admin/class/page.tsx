"use client";

import { useState } from "react";
import { useDeleteClass } from "@/hooks/useClass";
import { Button } from "@/components/ui/button";
import { ClassTable } from "./components/classTable";
import { ClassFormModal } from "./components/classModal";
import type { Class } from "@/lib/api/services/fetchClass";
import { ClassDeleteDialog } from "./components/classDeteleDialog";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/utils/error";

export default function ClassPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  const router = useRouter();
  const deleteClass = useDeleteClass();

  const handleAdd = () => {
    setSelectedClass(null);
    setIsFormOpen(true);
  };

  const handleView = (classItem: Class) => {
    router.push(`/admin/class/${classItem.id}`);
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
      toast({
        title: "Success notification!",
        description: "Class deleted successfully.",
      });
      setIsDeleteOpen(false);
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Failed to delete class. Please try again."
      );
      toast({
        title: "Oops! Something went wrong",
        description: message,
        variant: "destructive",
      });
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
      <ClassTable
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

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
