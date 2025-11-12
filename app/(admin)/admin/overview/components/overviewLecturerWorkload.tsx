"use client";

import { Pie, PieChart, Tooltip } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

interface LecturerWorkloadProps {
  data: {
    LecturerID: string;
    LecturerName: string;
    ClassesAssigned: number;
  }[];
}

export function OverviewLecturerWorkloadLegend({
  data,
}: LecturerWorkloadProps) {
  // convert API data → chart data theo structure của component mẫu
  const chartData = data.map((item, index) => ({
    lecturerKey: item.LecturerID,
    name: item.LecturerName,
    value: item.ClassesAssigned,
    fill: `var(--chart-${(index % 6) + 1})`,
  }));

  // tạo config legend tự động
  const chartConfig: ChartConfig = {
    value: { label: "Classes Assigned" },
    ...Object.fromEntries(
      chartData.map((item) => [
        item.lecturerKey,
        { label: item.name, color: item.fill },
      ])
    ),
  };

  return (
    <Card className="flex flex-col bg-white">
      <CardHeader className="items-center pb-0">
        <CardTitle>Lecturer Class Assignment</CardTitle>
        <CardDescription>
          Workload distribution across lecturers
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              labelLine={false}
              outerRadius={95}
            />
            <Tooltip
              formatter={(value) => `${value} classes`}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
              }}
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="lecturerKey" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/3 *:justify-center *:whitespace-nowrap"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
