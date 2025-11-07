"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { CSSProperties } from "react";

interface GroupEngagementData {
  classCode: string;
  selected: number;
  total: number;
}

interface OverviewClassEngagementProps {
  data: GroupEngagementData[];
}

export function OverviewClassEngagement({
  data,
}: OverviewClassEngagementProps) {
  const chartData = data.map((item) => ({
    classCode: item.classCode,
    selected: item.selected,
    total: item.total,
    percentage:
      item.total > 0 ? Math.round((item.selected / item.total) * 100) : 0,
  }));

  return (
    <Card className="border-gray-200 shadow-sm bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900">
          Class Project Topic Allocation
        </CardTitle>

        <p className="text-md text-slate-500 mt-2">
          Displays the percentage of student project groups in each class that
          have selected a topic.
        </p>

        <div className="flex items-center gap-4 mt-1 text-xs text-slate-600">
          <div className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full bg-[#FF6B00]" />
            <span>Topic Assigned</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full bg-slate-300" />
            <span>Awaiting Assignment</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {chartData.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-6">
            No class engagement data available.
          </p>
        )}

        {chartData.map((item) => (
          <div key={item.classCode} className="space-y-1">
            <div className="flex justify-between text-sm font-medium text-slate-700">
              <span>{item.classCode}</span>
              <span>
                {item.selected}/{item.total} groups ({item.percentage}%)
              </span>
            </div>

            <Progress
              value={item.percentage}
              className="h-2 rounded-full bg-slate-200 [&>[data-progress=indicator]]:bg-[#FF6B00]"
              style={{ "--progress-bar": "#FF6B00" } as CSSProperties}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
