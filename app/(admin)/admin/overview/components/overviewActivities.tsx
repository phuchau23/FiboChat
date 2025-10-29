"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { OverviewStats } from "@/mock/overview";

interface OverviewActivitiesProps {
  stats: OverviewStats;
}

export function OverviewActivities({ stats }: OverviewActivitiesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stats.recentActivities.length === 0 ? (
            <p className="text-muted-foreground">No recent activities</p>
          ) : (
            stats.recentActivities.map((activity) => (
              <div
                key={activity.ActivityID}
                className="flex items-start gap-4 pb-4 border-b last:border-b-0"
              >
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div className="flex-1">
                  <p className="font-medium">{activity.Type}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.Description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(activity.Timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
