"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SemesterStatusItem {
  semesterId: string;
  semesterName: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Inactive";
}

interface SemesterStatusProps {
  data: SemesterStatusItem[];
}

function formatDate(dateString: string) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-GB");
}

export function OverviewSemesterStatus({ data }: SemesterStatusProps) {
  return (
    <Card className="border-gray-200 shadow-sm bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900">
          Semester
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-700">
                  Semester
                </th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">
                  Start Date
                </th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">
                  End Date
                </th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {data.length ? (
                data.map((semester) => (
                  <tr key={semester.semesterId} className="hover:bg-slate-100">
                    <td className="py-3 px-4 text-slate-900 font-medium">
                      {semester.semesterName}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {formatDate(semester.startDate)}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {formatDate(semester.endDate)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        className={
                          semester.status === "Active"
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-800 hover:bg-slate-100"
                        }
                      >
                        {semester.status === "Active" ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-4 text-slate-500 italic"
                  >
                    No semester data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
