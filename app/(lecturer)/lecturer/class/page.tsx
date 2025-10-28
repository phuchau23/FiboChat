"use client";

import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Search,
  Users,
  CalendarDays,
  Clock,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { getCookie } from "cookies-next";
import Pagination from "../components/Pagination";
import { jwtDecode } from "jwt-decode";
import { useClassesByLecturer } from "@/hooks/useClass";

const PAGE_SIZE = 5;

interface DecodedToken {
  nameid: string; // lecturerId
  email: string;
  role: string;
  exp: number;
}

export default function ClassPage() {
  const [lecturerId, setLecturerId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // ✅ Decode lecturerId từ token
  useEffect(() => {
    const token = getCookie("auth-token");
    if (token && typeof token === "string") {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setLecturerId(decoded.nameid);
      } catch (error) {
        console.error("Token không hợp lệ:", error);
      }
    }
  }, []);

  const { classes, pagination, isLoading, isError, error } =
    useClassesByLecturer(lecturerId || "", page, PAGE_SIZE);

  const filteredClasses =
    classes?.filter((cls) =>
      cls.code.toLowerCase().includes(search.toLowerCase())
    ) || [];
  if (!lecturerId) {
    return (
      <div className="text-center text-orange-500 py-10 text-lg">
        Đang tải thông tin giảng viên...
      </div>
    );
  }

  return (
    <section className="bg-white rounded-3xl p-8 shadow-xl border border-orange-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-3">
        <h2 className="text-3xl font-bold text-orange-500 flex items-center gap-2">
          <Users className="h-7 w-7 text-orange-400" /> Class Management
        </h2>

        <div className="flex gap-3 items-center">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by class code..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-orange-300 focus:ring-2 focus:ring-orange-400 focus:outline-none transition"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="text-center text-orange-500 py-10 text-lg animate-pulse">
          Loading classes...
        </div>
      ) : isError ? (
        <div className="text-center text-red-500 py-10">
          {(error as Error)?.message || "Đã xảy ra lỗi không xác định."}
        </div>
      ) : filteredClasses.length === 0 ? (
        <div className="text-center text-gray-500 py-12 italic text-lg">
          Không tìm thấy lớp nào 😔
        </div>
      ) : (
        <div className="space-y-6">
          {filteredClasses.map((cls) => (
            <Link
              href={`/lecturer/class/${cls.id}`}
              key={cls.id}
              className="block group"
            >
              <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-white border border-orange-100 p-6 hover:shadow-lg transition">
                {/* Header */}
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xl font-semibold text-orange-600 flex items-center gap-2 group-hover:text-orange-700 transition">
                    <BookOpen className="h-5 w-5 text-orange-500" />
                    {cls.code}
                  </h4>
                  <span
                    className={`text-sm px-3 py-1 rounded-full ${
                      cls.status === "Active"
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {cls.status}
                  </span>
                </div>

                {/* Details */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-700 text-sm">
                  <p className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-orange-400" />
                    <span>
                      <span className="font-medium text-orange-600">
                        Semester:
                      </span>{" "}
                      {cls.semester?.code} - {cls.semester?.term}{" "}
                      {cls.semester?.year}
                    </span>
                  </p>

                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-400" />
                    <span>
                      <span className="font-medium text-orange-600">
                        Created:
                      </span>{" "}
                      {new Date(cls.createdAt).toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        <Pagination
          page={page}
          total={pagination?.totalItems || 0}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>
    </section>
  );
}
