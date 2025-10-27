"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SemesterTable } from "./components/semesterTable";
import { SemesterFormModal } from "./components/semesterModal";
import { SemesterDeleteDialog } from "./components/semesterDeleteDialog";
import { Semester } from "@/lib/api/services/fetchSemester";
import { useDeleteSemester } from "@/hooks/useSemester";

export default function SemesterPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState<Semester | null>(
    null
  );

  const deleteSemester = useDeleteSemester();

  if (deleteSemester.isPending) {
    return <p>Loading...</p>;
  }

  const handleAdd = () => {
    setSelectedSemester(null);
    setIsFormOpen(true);
  };

  const handleEdit = (semester: Semester) => {
    setSelectedSemester(semester);
    setIsFormOpen(true);
  };

  const handleDelete = (semester: Semester) => {
    setSelectedSemester(semester);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedSemester) return;
    try {
      await deleteSemester.mutateAsync(selectedSemester.id);
      setIsDeleteOpen(false);
    } catch (error) {
      console.error("Error deleting semester:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Semester Management</h1>
        <Button onClick={handleAdd}>Add Semester</Button>
      </div>

      <SemesterTable onEdit={handleEdit} onDelete={handleDelete} />

      <SemesterFormModal
        open={isFormOpen}
        selectedSemester={selectedSemester}
        onOpenChange={setIsFormOpen}
      />

      <SemesterDeleteDialog
        open={isDeleteOpen}
        selectedSemester={selectedSemester}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
        loading={deleteSemester.isPending}
      />
    </div>
  );
}
