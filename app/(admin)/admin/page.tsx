"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Bot,
  Zap,
  Users,
  TrendingUp,
  Brain,
  Target,
  MessageSquare,
} from "lucide-react";

export default function DashboardOverview() {
  const aiStats = [
    {
      title: "AI Response Rate",
      value: "94.2%",
      change: "+5.2%",
      icon: Bot,
      description: "Questions answered automatically",
      progress: 94.2,
    },
    {
      title: "Student Engagement",
      value: "87%",
      change: "+12%",
      icon: Users,
      description: "Active students using AI support",
      progress: 87,
    },
    {
      title: "Teacher Workload Reduction",
      value: "76%",
      change: "+8%",
      icon: Zap,
      description: "Time saved through AI automation",
      progress: 76,
    },
    {
      title: "Student Satisfaction",
      value: "91.5%",
      change: "+15%",
      icon: Target,
      description: "Positive feedback on AI responses",
      progress: 91.5,
    },
  ];

  const aiActivities = [
    {
      action: "AI Model Updated",
      detail: "Knowledge base expanded with new SWP392 guidelines",
      time: "1 hour ago",
      status: "success",
      percentage: "98%",
    },
    {
      action: "Knowledge Base Sync",
      detail: "Latest course materials and FAQs synchronized",
      time: "3 hours ago",
      status: "info",
      percentage: "100%",
    },
    {
      action: "Performance Optimization",
      detail: "Response time improved by 23%",
      time: "5 hours ago",
      status: "success",
      percentage: "95%",
    },
    {
      action: "Usage Analytics Updated",
      detail: "Student interaction patterns analyzed",
      time: "1 day ago",
      status: "info",
      percentage: "87%",
    },
  ];

  const aiServices = [
    {
      name: "Natural Language Processing",
      status: "Operational",
      usage: 92,
      questionsHandled: "2,847 questions",
      efficiency: "High",
    },
    {
      name: "Knowledge Base Management",
      status: "Operational",
      usage: 78,
      questionsHandled: "1,234 queries",
      efficiency: "Medium",
    },
    {
      name: "Automated Response System",
      status: "Optimizing",
      usage: 85,
      questionsHandled: "3,456 responses",
      efficiency: "High",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          AI Management Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Monitor AI performance and student engagement for the free SWP392
          intelligent support system.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {aiStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {stat.change}
                  </Badge>
                </div>
                <Progress value={stat.progress} className="mt-3 h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              {aiActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.status === "success"
                        ? "bg-green-500"
                        : "bg-blue-500"
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              AI Service Usage & Performance
            </CardTitle>
            <CardDescription>
              Current AI service utilization and question handling capacity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiServices.map((service, index) => (
                <div key={index} className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{service.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          service.status === "Operational"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {service.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span>Usage: {service.usage}%</span>
                    <span className="font-medium text-foreground">
                      {service.questionsHandled}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Progress
                      value={service.usage}
                      className="flex-1 mr-3 h-2"
                    />
                    <Badge variant="outline" className="text-xs">
                      {service.efficiency}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
