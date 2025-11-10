/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Trash2,
  Edit2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
} from "lucide-react";

export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  searchable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
  loading?: boolean;
  searchPlaceholder?: string;
}

type SortDirection = "asc" | "desc" | null;

export function DataTable<T extends { [key: string]: any }>({
  columns,
  data,
  onEdit,
  onDelete,
  onView,
  loading,
  searchPlaceholder = "Search...",
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter((row) => {
        return columns.some((col) => {
          if (!col.searchable) return false;
          const rawValue = row[col.key];

          let stringValue = "";

          if (rawValue == null) {
            stringValue = "";
          } else if (typeof rawValue === "object") {
            stringValue =
              rawValue.fullName ??
              rawValue.name ??
              rawValue.title ??
              JSON.stringify(rawValue);
          } else {
            stringValue = String(rawValue);
          }

          return stringValue.toLowerCase().includes(lowerSearchTerm);
        });
      });
    }

    // Apply sorting
    if (sortKey && sortDirection) {
      result.sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];

        if (aValue === bValue) return 0;
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }

        return 0;
      });
    }

    return result;
  }, [data, searchTerm, sortKey, sortDirection, columns]);

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortKey(null);
      }
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (key: keyof T) => {
    if (sortKey !== key) return <ArrowUpDown className="w-4 h-4 opacity-50" />;
    if (sortDirection === "asc") return <ArrowUp className="w-4 h-4" />;
    if (sortDirection === "desc") return <ArrowDown className="w-4 h-4" />;
    return <ArrowUpDown className="w-4 h-4 opacity-50" />;
  };

  // Hàm format giá trị hiển thị (UI format dd/mm/yyyy)
  const formatValue = (value: any) => {
    if (!value) return "-";

    // Nếu là ISO date → format dd/mm/yyyy
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
      const d = new Date(value);
      return (
        d.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }) +
        " " +
        d.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    }

    return String(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="border shadow-sm rounded-lg overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={String(col.key)}>
                  {col.sortable ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort(col.key)}
                      className="h-8 gap-2 -ml-3"
                    >
                      {col.label}
                      {getSortIcon(col.key)}
                    </Button>
                  ) : (
                    col.label
                  )}
                </TableHead>
              ))}
              {(onView || onEdit || onDelete) && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="text-center py-8"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredAndSortedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="text-center py-8 text-muted-foreground"
                >
                  {searchTerm ? "No results found" : "No data available"}
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedData.map((row, idx) => (
                <TableRow key={idx}>
                  {columns.map((col) => (
                    <TableCell key={String(col.key)}>
                      {col.render
                        ? col.render(row[col.key], row)
                        : formatValue(row[col.key])}
                    </TableCell>
                  ))}
                  {(onView || onEdit || onDelete) && (
                    <TableCell>
                      <div className="flex gap-2">
                        {onView && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onView(row)}
                          >
                            <Eye className="w-4 h-4 text-gray-500" />
                          </Button>
                        )}
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(row)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(row)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
