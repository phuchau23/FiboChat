"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Calendar } from "lucide-react";
import type { OverviewStats } from "@/mock/overview";

interface OverviewStatusProps {
  stats: OverviewStats;
}

export function OverviewStatus({ stats }: OverviewStatusProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                stats.systemStatus === "operational"
                  ? "bg-green-500"
                  : stats.systemStatus === "degraded"
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            />
            <span className="capitalize font-medium">{stats.systemStatus}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Active Semester
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-medium">{stats.activeSemester}</p>
        </CardContent>
      </Card>
    </div>
  );
}
