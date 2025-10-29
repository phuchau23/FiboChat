"use client";

import {
  type Column,
  DataTable,
} from "@/app/(admin)/admin/components/data-table";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { useUser } from "@/hooks/useUser";
import { User } from "@/lib/api/services/fetchUser";
import { format } from "date-fns";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";

interface UserTableProps {
  onDelete: (user: User) => void;
}

export function UserTable({ onDelete }: UserTableProps) {
  const [page, setPage] = useState(1);
  const { users, pagination, isError, isLoading } = useUser(page);

  const columns: Column<User>[] = [
    { key: "studentID", label: "Student ID", searchable: true, sortable: true },
    {
      key: "firstname",
      label: "Full Name",
      render: (_, row) => `${row.firstname} ${row.lastname}`,
      searchable: true,
      sortable: true,
    },
    { key: "email", label: "Email", searchable: true, sortable: true },
    {
      key: "isVerified",
      label: "Verified",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"
          }`}
        >
          {value ? "Verified" : "Unverified"}
        </span>
      ),
      sortable: true,
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (value) => format(new Date(value), "dd/MM/yyyy - HH:mm"),
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
        Lỗi khi tải danh sách sinh viên!
      </p>
    );
  }

  return (
    <div>
      <DataTable
        columns={columns}
        data={users || []}
        loading={isLoading}
        onDelete={onDelete}
        searchPlaceholder="Search by name, email, or student ID..."
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
                      ? "opacity-50 pointer-events-none mx-4 cursor-not-allowed"
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
