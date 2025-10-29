"use client";

import { useState } from "react";
import {
  type Column,
  DataTable,
} from "@/app/(admin)/admin/components/data-table";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { useDomains } from "@/hooks/useDomain";
import { Domain } from "@/lib/api/services/fetchDomain";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useQueryClient } from "@tanstack/react-query";

interface DomainTableProps {
  onEdit: (domain: Domain) => void;
  onDelete: (domain: Domain) => void;
}

export function DomainTable({ onEdit, onDelete }: DomainTableProps) {
  const [page, setPage] = useState(1);
  const { domains, pagination, isLoading, isError } = useDomains(page, 10);
  const queryClient = useQueryClient();

  const columns: Column<Domain>[] = [
    {
      key: "name",
      label: "Domain Name",
      searchable: true,
      sortable: true,
    },
    {
      key: "description",
      label: "Description",
      searchable: true,
      sortable: false,
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
      render: (value: string) =>
        new Date(value).toLocaleDateString("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
    },
  ];

  if (isLoading)
    return (
      <div className="flex h-[400px] items-center justify-center">
        <TableSkeleton />
      </div>
    );
  if (isError)
    return (
      <p className="text-center text-red-500">
        Lỗi khi tải danh sách domain. Vui lòng thử lại sau.
      </p>
    );

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={domains || []}
        onEdit={(domain) => {
          onEdit(domain);
          queryClient.invalidateQueries({ queryKey: ["domains"] });
        }}
        onDelete={onDelete}
        loading={isLoading}
        searchPlaceholder="Search by domain name..."
      />

      {/* Pagination */}
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
