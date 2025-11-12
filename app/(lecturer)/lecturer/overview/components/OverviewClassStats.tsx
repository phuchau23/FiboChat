"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useClassesByLecturer } from "@/hooks/useClass";
import { fetchGroups } from "@/lib/api/services/fetchGroup";
import { useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getCookie } from "cookies-next";
import { Skeleton } from "@/components/ui/skeleton";
import { useSemesters } from "@/hooks/useSemester";

interface DecodedToken {
  nameid: string;
}

export function OverviewClassStats() {
  const [lecturerId, setLecturerId] = useState<string | null>(null);
  const [selectedSemesterId, setSelectedSemesterId] = useState<string | null>(null);

  // Lấy lecturerId từ token
  useEffect(() => {
    const token = getCookie("auth-token");
    if (token && typeof token === "string") {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setLecturerId(decoded.nameid);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        console.error("Invalid token");
      }
    }
  }, []);

  // Lấy danh sách kỳ học
  const { semesters, isLoading: loadingSemesters } = useSemesters(1, 100);

  // Lấy tất cả lớp của giảng viên
  const { classes: allClasses, isLoading: loadingClasses } = useClassesByLecturer(lecturerId || "", 1, 100);

  // Filter lớp theo kỳ học
  const classes = useMemo(() => {
    if (!selectedSemesterId) return allClasses || [];
    return (allClasses || []).filter((cls) => cls.semester.id === selectedSemesterId);
  }, [allClasses, selectedSemesterId]);

  // Tổng số sinh viên & nhóm
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalGroups, setTotalGroups] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (!lecturerId || !classes || classes.length === 0) {
      setTotalGroups(0);
      setTotalStudents(0);
      return;
    }

    const calculateTotals = async () => {
      setIsCalculating(true);
      try {
        const groupCounts: number[] = [];
        const studentCounts: number[] = [];

        for (const cls of classes) {
          const groupsWithMembers = await fetchGroups.getByClassIdWithMembers(cls.id);
          groupCounts.push(groupsWithMembers.length);
          const totalMembersInClass = groupsWithMembers.reduce((sum, g) => sum + g.members.length, 0);
          studentCounts.push(totalMembersInClass);
        }

        setTotalGroups(groupCounts.reduce((a, b) => a + b, 0));
        setTotalStudents(studentCounts.reduce((a, b) => a + b, 0));
      } catch (error) {
        console.error(error);
      } finally {
        setIsCalculating(false);
      }
    };

    calculateTotals();
  }, [lecturerId, classes]);

  // Dữ liệu biểu đồ
  const chartData = useMemo(
    () => [
      { name: "Classes", value: classes.length },
      { name: "Groups", value: totalGroups },
      { name: "Students", value: totalStudents },
    ],
    [classes.length, totalGroups, totalStudents]
  );

  const isLoading = loadingClasses || loadingSemesters || isCalculating;

  if (!lecturerId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Class & Group Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Đang xác thực...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Class & Group Overview</CardTitle>
        <p className="text-sm text-gray-500">Total number of classes, groups, and students you are managing.</p>

        {/* Dropdown chọn kỳ học */}
        <div className="mt-2">
          {loadingSemesters ? (
            <Skeleton className="h-8 w-1/3" />
          ) : (
            <select
              className="border rounded px-2 py-1 text-sm"
              value={selectedSemesterId || ""}
              onChange={(e) => setSelectedSemesterId(e.target.value || null)}
            >
              <option value="">All semesters</option>
              {semesters?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} - {s.term}/{s.year}
                </option>
              ))}
            </select>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #fed7aa",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="value" fill="#fa7a1c" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        )}

        <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <p className="font-semibold text-orange-600">{chartData[0].value}</p>
            <p className="text-gray-500">Class</p>
          </div>
          <div>
            <p className="font-semibold text-orange-600">{chartData[1].value}</p>
            <p className="text-gray-500">Group</p>
          </div>
          <div>
            <p className="font-semibold text-orange-600">{chartData[2].value}</p>
            <p className="text-gray-500">Students</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
