"use client";

import {
  type Column,
  DataTable,
} from "@/app/(admin)/admin/components/data-table";
import { Lecturer, MasterTopic } from "@/lib/api/services/fetchMasterTopic";
import { useMasterTopics } from "@/hooks/useMasterTopic";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
interface MasterTopicTableProps {
  onEdit: (masterTopic: MasterTopic) => void;
  onDelete: (masterTopic: MasterTopic) => void;
}

export function MasterTopicTable({ onEdit, onDelete }: MasterTopicTableProps) {
  const [page, setPage] = useState(1);
  const { masterTopics, pagination, isLoading, isError } = useMasterTopics(
    page,
    10
  );
  const queryClient = useQueryClient();

  const columns: Column<MasterTopic>[] = [
    {
      key: "name",
      label: "Master Topic Name",
      searchable: true,
      sortable: true,
    },
    {
      key: "domain",
      label: "Domain",
      render: (domain) => domain?.name ?? "—",
      searchable: true,
      sortable: true,
    },
    {
      key: "semester",
      label: "Semester",
      render: (semester) => semester?.code || "—",
      searchable: true,
    },
    {
      key: "lecturers",
      label: "Lecturers",
      render: (lecturers) =>
        lecturers && lecturers.length > 0
          ? lecturers.map((l: Lecturer) => l.fullName).join(", ")
          : "—",
      searchable: true,
    },
    {
      key: "description",
      label: "Description",
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
              : "bg-yellow-100 text-red-600"
          }`}
        >
          {value}
        </span>
      ),
      searchable: true,
      sortable: true,
    },
    {
      key: "createdAt",
      label: "Created At",
      sortable: true,
      render: (value) => new Date(value).toLocaleString(),
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

  if (isError) return <p className="text-red-500">Lỗi khi tải dữ liệu</p>;

  return (
    <div className="space-y-6">
      <DataTable
        columns={columns}
        data={masterTopics || []}
        onEdit={(masterTopic) => {
          onEdit(masterTopic);
          queryClient.invalidateQueries({ queryKey: ["masterTopics"] });
        }}
        onDelete={onDelete}
        loading={isLoading}
        searchPlaceholder="Search by name, domain, or lecturer..."
      />

      {pagination && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => pagination.hasPreviousPage && setPage(page - 1)}
                className={
                  !pagination.hasPreviousPage
                    ? "opacity-50 pointer-events-none mx-7"
                    : "mx-7"
                }
              />
            </PaginationItem>

            {Array.from({ length: pagination.totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => setPage(i + 1)}
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
                    : "mx-4"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
