"use client";

import { useState } from "react";
import { Lecturer } from "@/lib/api/services/fetchLecturer";
import { LecturerTable } from "./components/lectureTable";
import { LecturerFormModal } from "./components/lectureModal";
import { LecturerDeleteDialog } from "./components/lectureDeleteDialog";

export default function LecturerPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedLecturer, setSelectedLecturer] = useState<Lecturer | null>(
    null
  );

  const handleAdd = () => {
    setSelectedLecturer(null);
    setIsFormOpen(true);
  };

  const handleEdit = (lecturer: Lecturer) => {
    setSelectedLecturer(lecturer);
    setIsFormOpen(true);
  };

  const handleDelete = (lecturer: Lecturer) => {
    setSelectedLecturer(lecturer);
    setIsDeleteOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Lecturer Management</h1>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        >
          Add Lecturer
        </button>
      </div>

      {/* Table */}
      <LecturerTable onEdit={handleEdit} onDelete={handleDelete} />

      {/* Form Modal */}
      <LecturerFormModal
        open={isFormOpen}
        selectedLecturer={selectedLecturer}
        onOpenChange={setIsFormOpen}
      />

      {/* Delete Dialog */}
      <LecturerDeleteDialog
        open={isDeleteOpen}
        selectedLecturer={selectedLecturer}
        onOpenChange={setIsDeleteOpen}
      />
    </div>
  );
}
