"use client";

import {
  type Column,
  DataTable,
} from "@/app/(admin)/admin/components/data-table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import useClasses from "@/hooks/useClass";
import type { Class } from "@/lib/api/services/fetchClass";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface ClassTableProps {
  onEdit: (classItem: Class) => void;
  onDelete: (classItem: Class) => void;
  onView: (classItem: Class) => void;
}

export function ClassTable({ onEdit, onDelete, onView }: ClassTableProps) {
  const [page, setPage] = useState(1);
  const { classes, pagination, isLoading, isError } = useClasses(page, 10);
  const queryClient = useQueryClient();

  const columns: Column<Class>[] = [
    { key: "code", label: "Code", searchable: true, sortable: true },
    {
      key: "semester",
      label: "Semester",
      render: (value) => `${value.code}`,
    },
    {
      key: "lecturer",
      label: "Lecturer",
      render: (value) => value?.fullName || "N/A",
      searchable: true,
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === "Active"
              ? "bg-green-100 text-green-600"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {value}
        </span>
      ),
      sortable: true,
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (value) => new Date(value).toLocaleDateString("vi-VN"),
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
        data={classes || []}
        onEdit={(classItem) => {
          onEdit(classItem);
          queryClient.invalidateQueries({ queryKey: ["classes"] });
        }}
        onView={onView}
        onDelete={onDelete}
        loading={isLoading}
        searchPlaceholder="Search by code or lecturer..."
      />

      {/* Pagination */}
      {pagination && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    pagination.hasPreviousPage && setPage(page - 1)
                  }
                  className={
                    !pagination.hasPreviousPage
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
