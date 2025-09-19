"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain } from "lucide-react";

export type Activity = {
  action: string;
  detail: string;
  time: string;
  status: "success" | "info";
  percentage: string;
};

export default function AIActivities({
  activities,
}: {
  activities: Activity[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Performance Metrics
        </CardTitle>
        <CardDescription>
          Recent AI system activities and performance updates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  activity.status === "success" ? "bg-green-500" : "bg-blue-500"
                }`}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">
                    {activity.action}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {activity.percentage}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {activity.detail}
                </p>
              </div>
              <span className="text-xs text-muted-foreground">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
