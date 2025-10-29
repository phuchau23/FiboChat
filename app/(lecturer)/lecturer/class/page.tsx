"use client";

import React, { useState, useEffect } from "react";
import { PlusCircle, Search, Users, CalendarDays, Clock, BookOpen } from "lucide-react";
import Link from "next/link";
import { getCookie } from "cookies-next";
import Pagination from "../components/Pagination";
import { jwtDecode } from "jwt-decode";
import { useClassesByLecturer } from "@/hooks/useClass";
import { useToast } from "@/hooks/use-toast";

// Kích thước page
const PAGE_SIZE = 5;

interface DecodedToken {
  nameid: string; // lecturerId
  email: string;
  role: string;
  exp: number;
}

// Skeleton card
const CardSkeleton = () => <div className="animate-pulse rounded-3xl bg-gray-100 h-56 w-full p-6"></div>;

export default function ClassPage() {
  const [lecturerId, setLecturerId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  // ✅ Decode lecturerId từ token
  useEffect(() => {
    const token = getCookie("auth-token");
    if (token && typeof token === "string") {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setLecturerId(decoded.nameid);
      } catch (error) {
        console.error("Token không hợp lệ:", error);
        toast({
          title: "Lỗi token",
          description: "Token không hợp lệ, vui lòng đăng nhập lại.",
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  const { classes, pagination, isLoading, isError, error } = useClassesByLecturer(lecturerId || "", page, PAGE_SIZE);

  const filteredClasses = classes?.filter((cls) => cls.code.toLowerCase().includes(search.toLowerCase())) || [];

  if (!lecturerId) {
    return <div className="text-center text-orange-500 py-10 text-lg">Đang tải thông tin giảng viên...</div>;
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 place-items-stretch">
          {Array.from({ length: PAGE_SIZE }).map((_, idx) => (
            <CardSkeleton key={idx} />
          ))}
        </div>
      ) : isError ? (
        <>
          {toast({
            title: "Lỗi tải lớp",
            description: (error as Error)?.message || "Đã xảy ra lỗi không xác định.",
            variant: "destructive",
          })}
          <div className="text-center text-red-500 py-10">
            {(error as Error)?.message || "Đã xảy ra lỗi không xác định."}
          </div>
        </>
      ) : filteredClasses.length === 0 ? (
        <div className="text-center text-gray-500 py-12 italic text-lg">Không tìm thấy lớp nào 😔</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 place-items-stretch">
          {filteredClasses.map((cls) => (
            <Link
              href={`/lecturer/class/${cls.id}`}
              key={cls.id}
              className="group rounded-3xl bg-white shadow-md border border-gray-100 p-6 hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              {/* Icon + Menu */}
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-full text-white text-xl font-bold
            ${
              cls.status === "Active"
                ? "bg-gradient-to-br from-orange-400 to-orange-500"
                : "bg-gradient-to-br from-gray-400 to-gray-500"
            }`}
                >
                  {cls.code?.charAt(0) || "C"}
                </div>
                <button className="text-gray-400 hover:text-gray-600 transition">•••</button>
              </div>

              {/* Title */}
              <h4 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-orange-600 transition">
                {cls.code}
              </h4>

              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                  <Users className="h-4 w-4 text-orange-500" />
                </div>
                <p className="text-sm text-gray-600">My class</p>
              </div>

              {/* Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4 text-orange-400" />
                  {cls.semester?.code || "N/A"}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-orange-400" />
                  {new Date(cls.createdAt).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        <Pagination page={page} total={pagination?.totalItems || 0} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </div>
    </section>
  );
}
