"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Layers, type LucideIcon } from "lucide-react";
import type { KPIStats } from "@/app/(admin)/admin/overview/page";

interface KPICardsProps {
  stats: KPIStats;
}

type KPIColor = "orange" | "purple" | "blue" | "indigo";

export function OverviewKPICards({ stats }: KPICardsProps) {
  const kpiCards: {
    title: string;
    value: number;
    trend?: number;
    lastMonthValue?: number;
    icon: LucideIcon;
    color: KPIColor;
  }[] = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      trend: stats.studentsTrend,
      lastMonthValue: stats.lastMonthStudents,
      icon: Users,
      color: "orange",
    },
    {
      title: "Total Lecturers",
      value: stats.totalLecturers,
      trend: stats.lecturersTrend,
      lastMonthValue: stats.lastMonthLecturers,
      icon: BookOpen,
      color: "purple",
    },
    {
      title: "Total Classes",
      value: stats.totalClasses,
      trend: stats.classesTrend,
      lastMonthValue: stats.lastMonthClasses,
      icon: Layers,
      color: "blue",
    },
    {
      title: "Total Topics",
      value: stats.totalTopics,
      trend: stats.topicsTrend,
      lastMonthValue: stats.lastMonthTopics,
      icon: BookOpen,
      color: "indigo",
    },
  ];

  const colorMap = {
    orange: {
      bg: "bg-orange-50",
      icon: "text-orange-600",
      iconBg: "bg-orange-100",
    },
    purple: {
      bg: "bg-purple-50",
      icon: "text-purple-600",
      iconBg: "bg-purple-100",
    },
    blue: {
      bg: "bg-blue-50",
      icon: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    indigo: {
      bg: "bg-indigo-50",
      icon: "text-indigo-600",
      iconBg: "bg-indigo-100",
    },
  } as const;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[1fr]">
      {kpiCards.map(
        ({ title, value, trend, lastMonthValue, icon: Icon, color }) => {
          const colorScheme = colorMap[color];
          const isPositive = trend !== undefined && trend > 0;
          const isNegative = trend !== undefined && trend < 0;

          return (
            <Card
              key={title}
              className="flex flex-col h-full border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white overflow-hidden rounded-3xl"
            >
              <CardHeader className="flex flex-row items-start justify-between px-5">
                <div className="flex-1">
                  <CardTitle className="text-md font-medium text-slate-500">
                    {title}
                  </CardTitle>

                  <div className="flex items-center gap-2 pt-3">
                    <div className="relative flex items-center">
                      <span className="text-5xl font-bold text-slate-900">
                        {value.toLocaleString()}
                      </span>

                      {trend !== undefined && (
                        <div
                          className={`absolute left-full ml-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-full ${
                            isPositive
                              ? "bg-emerald-50 text-emerald-600"
                              : isNegative
                              ? "bg-red-50 text-red-600"
                              : "bg-slate-50 text-slate-600"
                          }`}
                        >
                          <span className="text-base">
                            {isPositive ? "↑" : isNegative ? "↓" : "→"}
                          </span>
                          <span>{Math.abs(trend).toFixed(1)}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className={`p-2.5 rounded-xl ${colorScheme.iconBg}`}>
                  <Icon className={`w-5 h-5 ${colorScheme.icon}`} />
                </div>
              </CardHeader>

              <CardContent className="px-5">
                {lastMonthValue !== undefined && (
                  <div className="text-md text-slate-500 mt-1">
                    Last month:{" "}
                    <span className="font-semibold text-slate-700">
                      {lastMonthValue.toLocaleString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        }
      )}
    </div>
  );
}
