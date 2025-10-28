"use client";

import { type Column, DataTable } from "@/components/common/data-table";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import useLecturers from "@/hooks/useLecturer";
import { Lecturer } from "@/lib/api/services/fetchLecturer";
import { useQueryClient } from "@tanstack/react-query";

interface LecturerTableProps {
  onEdit: (lecturer: Lecturer) => void;
  onDelete: (lecturer: Lecturer) => void;
}

export function LecturerTable({ onEdit, onDelete }: LecturerTableProps) {
  const { lecturers, isLoading, isError } = useLecturers();
  const queryClient = useQueryClient();

  const columns: Column<Lecturer>[] = [
    {
      key: "fullName",
      label: "Full Name",
      searchable: true,
      sortable: true,
    },
    {
      key: "email",
      label: "Email",
      searchable: true,
      sortable: true,
    },
    {
      key: "gender",
      label: "Gender",
      searchable: true,
      sortable: true,
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === "Active"
              ? "bg-green-200 text-green-600"
              : "bg-red-200 text-red-600"
          }`}
        >
          {value}
        </span>
      ),
      searchable: true,
      sortable: true,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="w-full max-w-6xl">
          <TableSkeleton rows={6} cols={columns.length} />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-red-500 text-center text-md font-serif">
        Lỗi khi tải danh sách giảng viên!
      </p>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={lecturers || []}
      onEdit={(lecturer) => {
        onEdit(lecturer);
        queryClient.invalidateQueries({ queryKey: ["lecturers"] });
      }}
      onDelete={onDelete}
      loading={isLoading}
      searchPlaceholder="Search by name, email, gender, or status"
    />
  );
}
