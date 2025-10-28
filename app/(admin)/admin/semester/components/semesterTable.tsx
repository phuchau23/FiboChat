"use client";

import { type Column, DataTable } from "@/components/common/data-table";
import { useSemesters } from "@/hooks/useSemester";
import { Semester } from "@/lib/api/services/fetchSemester";
import { useQueryClient } from "@tanstack/react-query";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";
import { TableSkeleton } from "@/components/ui/table-skeleton";

interface SemesterTableProps {
  onEdit: (semester: Semester) => void;
  onDelete: (semester: Semester) => void;
}

export function SemesterTable({ onEdit, onDelete }: SemesterTableProps) {
  const [page, setPage] = useState(1);
  const { semesters, pagination, isLoading, isError } = useSemesters(page, 10);
  const queryClient = useQueryClient();

  const columns: Column<Semester>[] = [
    { key: "code", label: "Code", searchable: true, sortable: true },
    { key: "term", label: "Term", searchable: true, sortable: true },
    { key: "year", label: "Year", searchable: true, sortable: true },
    { key: "startDate", label: "Start Date", sortable: true },
    { key: "endDate", label: "End Date", sortable: true },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === "Active"
              ? "bg-green-100 text-green-600"
              : value === "Pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-200 text-gray-600"
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
          <TableSkeleton rows={6} cols={6} />
        </div>
      </div>
    );
  }

  if (isError)
    return (
      <p className="text-red-500 text-center text-md font-serif">
        Lỗi khi tải dữ liệu!
      </p>
    );

  return (
    <div className="space-y-6">
      <DataTable
        columns={columns}
        data={semesters || []}
        onEdit={(semester) => {
          onEdit(semester);
          queryClient.invalidateQueries({ queryKey: ["semesters"] });
        }}
        onDelete={onDelete}
        loading={isLoading}
        searchPlaceholder="Search by code, year, or term..."
      />

      {/* Pagination */}
      {pagination && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => pagination.hasPrevPage && setPage(page - 1)}
                  className={
                    !pagination.hasPrevPage
                      ? "opacity-50 pointer-events-none mx-7"
                      : "mx-7 cursor-pointer"
                  }
                />
              </PaginationItem>

              {Array.from({ length: pagination.totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => {
                      setPage(i + 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    isActive={pagination.currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => pagination.hasNextPage && setPage(page + 1)}
                  className={
                    !pagination.hasNextPage
                      ? "opacity-50 pointer-events-none mx-4"
                      : "mx-4 cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
