"use client";

import { type Column, DataTable } from "@/components/common/data-table";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { useTopics } from "@/hooks/useTopic";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { Topic } from "@/lib/api/services/fetchTopic";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface TopicTableProps {
  onEdit: (topic: Topic) => void;
  onDelete: (topic: Topic) => void;
}

export function TopicTable({ onEdit, onDelete }: TopicTableProps) {
  const [page, setPage] = useState(1);
  const { topics, pagination, isLoading, isError } = useTopics(page, 10);
  const queryClient = useQueryClient();

  const columns: Column<Topic>[] = [
    {
      key: "name",
      label: "Topic Name",
      searchable: true,
      sortable: true,
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
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
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
      sortable: true,
      render: (value) => new Date(value).toLocaleString(),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="w-full max-w-6xl">
          <TableSkeleton rows={6} cols={4} />
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
        data={topics || []}
        onEdit={(topic) => {
          onEdit(topic);
          queryClient.invalidateQueries({ queryKey: ["topics"] });
        }}
        onDelete={onDelete}
        loading={isLoading}
        searchPlaceholder="Search by topic name or description..."
      />

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
