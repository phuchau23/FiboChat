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
import { MessageSquare } from "lucide-react";

export type Service = {
  name: string;
  status: "Operational" | "Optimizing";
  usage: number;
  questionsHandled: string;
  efficiency: string;
};

export default function AIServices({ services }: { services: Service[] }) {
  return (
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
          {services.map((service, index) => (
            <div key={index} className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{service.name}</span>
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
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>Usage: {service.usage}%</span>
                <span className="font-medium text-foreground">
                  {service.questionsHandled}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <Progress value={service.usage} className="flex-1 mr-3 h-2" />
                <Badge variant="outline" className="text-xs">
                  {service.efficiency}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
