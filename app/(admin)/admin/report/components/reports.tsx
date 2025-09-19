"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, BarChart3, PieChart } from "lucide-react";

export function Reports() {
  const reports = [
    {
      title: "Weekly Activity Report",
      description: "Student engagement and chatbot usage statistics",
      type: "weekly",
      lastGenerated: "2024-01-15",
      icon: BarChart3,
    },
    {
      title: "Teacher Performance Analytics",
      description: "Course management and student feedback analysis",
      type: "monthly",
      lastGenerated: "2024-01-01",
      icon: PieChart,
    },
    {
      title: "System Usage Report",
      description: "Platform utilization and technical metrics",
      type: "daily",
      lastGenerated: "2024-01-16",
      icon: FileText,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Reports & Analytics
        </h1>
        <p className="text-muted-foreground mt-2">
          Generate and download comprehensive reports on SWP392 course
          activities and performance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {reports.map((report, index) => {
          const Icon = report.icon;
          return (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <CardDescription className="capitalize">
                      {report.type} report
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {report.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Last: {report.lastGenerated}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2 bg-transparent"
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
