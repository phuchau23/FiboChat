"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface LecturerWorkloadProps {
  data: {
    LecturerID: string;
    LecturerName: string;
    ClassesAssigned: number;
  }[];
}

const COLORS = [
  "#FF6B00",
  "#6B5BFF",
  "#28A745",
  "#F59E0B",
  "#EC4899",
  "#8B5CF6",
];

export function OverviewLecturerWorkload({ data }: LecturerWorkloadProps) {
  const chartData = data.map((item) => ({
    name: item.LecturerName,
    value: item.ClassesAssigned,
  }));

  return (
    <Card className="border-gray-200 shadow-sm bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900">
          Lecturer Class Assignment
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name} (${value})`}
              outerRadius={85}
              dataKey="value"
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) => `${value} classes`}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
