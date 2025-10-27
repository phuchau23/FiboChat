"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Layers, FileText } from "lucide-react";
import type { OverviewStats } from "@/mock/overview";

interface OverviewStatsProps {
  stats: OverviewStats;
}

export function OverviewStatsCards({ stats }: OverviewStatsProps) {
  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Total Lecturers",
      value: stats.totalLecturers,
      icon: BookOpen,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Total Classes",
      value: stats.totalClasses,
      icon: Layers,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Total Topics",
      value: stats.totalTopics,
      icon: FileText,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
