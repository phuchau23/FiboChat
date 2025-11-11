"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  BookOpen,
  Layers,
  Calendar,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import type { KPIStats } from "@/app/(admin)/admin/overview/page";

interface KPICardsProps {
  stats: KPIStats;
}

type KPIColor = "orange" | "purple" | "emerald" | "blue" | "indigo";

export function OverviewKPICards({ stats }: KPICardsProps) {
  const kpiCards: {
    title: string;
    value: number;
    trend?: number;
    icon: LucideIcon;
    color: KPIColor;
  }[] = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      trend: stats.studentsTrend,
      icon: Users,
      color: "orange",
    },
    {
      title: "Total Lecturers",
      value: stats.totalLecturers,
      icon: BookOpen,
      color: "purple",
    },
    {
      title: "Active Semesters",
      value: stats.activeSemesters,
      icon: Calendar,
      color: "emerald",
    },
    {
      title: "Total Classes",
      value: stats.totalClasses,
      icon: Layers,
      color: "blue",
    },
    {
      title: "Total Topics",
      value: stats.totalTopics,
      icon: BookOpen,
      color: "indigo",
    },
  ];

  const colorMap = {
    orange: {
      gradient: "from-orange-50 to-orange-100",
      icon: "text-orange-600",
    },
    purple: {
      gradient: "from-purple-50 to-purple-100",
      icon: "text-purple-600",
    },
    emerald: {
      gradient: "from-emerald-50 to-emerald-100",
      icon: "text-emerald-600",
    },
    blue: { gradient: "from-blue-50 to-blue-100", icon: "text-blue-600" },
    indigo: {
      gradient: "from-indigo-50 to-indigo-100",
      icon: "text-indigo-600",
    },
  } as const;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {kpiCards.map(({ title, value, trend, icon: Icon, color }) => {
        const colorScheme = colorMap[color];

        return (
          <Card
            key={title}
            className="border-2 shadow-sm hover:shadow-md transition-shadow bg-white"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 truncate">
                {title}
              </CardTitle>
              <div
                className={`p-2 rounded-lg bg-gradient-to-br ${colorScheme.gradient}`}
              >
                <Icon className={`w-4 h-4 ${colorScheme.icon}`} />
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex items-baseline gap-1">
                <div className="text-2xl font-bold text-slate-900">{value}</div>

                {trend !== undefined && trend !== 0 && (
                  <div className="flex items-center gap-0.5 text-xs font-medium text-emerald-600">
                    <TrendingUp className="w-3 h-3" />
                    <span>+{trend}%</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
