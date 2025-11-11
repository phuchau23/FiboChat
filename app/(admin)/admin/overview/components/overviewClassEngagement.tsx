"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Cell } from "recharts";
import { ClassEngagementModal } from "./classEngagementModal";

interface GroupEngagementData {
  classCode: string;
  selected: number;
  total: number;
  groups: { groupName: string; topicName: string | null }[];
}

interface OverviewClassEngagementProps {
  data: GroupEngagementData[];
}

export function OverviewClassEngagement({
  data,
}: OverviewClassEngagementProps) {
  const [modalData, setModalData] = useState<{
    classCode: string | null;
    groups: { groupName: string; topicName: string | null }[];
  }>({ classCode: null, groups: [] });

  const chartData = data.map((item) => {
    const percentage =
      item.total > 0 ? Math.round((item.selected / item.total) * 100) : 0;

    let color = "#10B981";
    if (percentage < 30) color = "#EF4444";
    else if (percentage < 80) color = "#F59E0B";

    return { ...item, percentage, color };
  });

  const chartConfig: ChartConfig = {
    percentage: { label: "% Assigned" },
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>Class Topic Selection Progress</CardTitle>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-72 w-full">
          <BarChart data={chartData} layout="vertical" margin={{ left: 16 }}>
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis
              dataKey="classCode"
              type="category"
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => `${value}%`}
                  hideLabel
                />
              }
            />

            <Bar
              dataKey="percentage"
              radius={6}
              onClick={(entry) =>
                setModalData({
                  classCode: entry.classCode,
                  groups: entry.groups,
                })
              }
              className="cursor-pointer"
            >
              {chartData.map((item, idx) => (
                <Cell key={idx} fill={item.color} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>

      <ClassEngagementModal
        open={modalData.classCode !== null}
        onClose={() => setModalData({ classCode: null, groups: [] })}
        classCode={modalData.classCode}
        groups={modalData.groups}
      />
    </Card>
  );
}
