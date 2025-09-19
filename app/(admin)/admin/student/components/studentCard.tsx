"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users } from "lucide-react";

export default function StudentCard() {
  const groups = [
    {
      id: "SE1801-G01",
      name: "EduTech Solutions",
      members: ["Nguyen A", "Tran B", "Le C", "Pham D"],
      topic: "Educational Management System",
      progress: 75,
      status: "on-track",
    },
    {
      id: "SE1801-G02",
      name: "HealthCare Plus",
      members: ["Vo E", "Hoang F", "Dang G", "Bui H"],
      topic: "Hospital Management System",
      progress: 60,
      status: "behind",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {groups.map((group) => (
        <Card key={group.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  {group.name}
                </CardTitle>
                <CardDescription>{group.id}</CardDescription>
              </div>
              <Badge
                className={
                  group.status === "on-track"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }
              >
                {group.status === "on-track" ? "On Track" : "Behind Schedule"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Project Topic:</p>
                <p className="text-sm text-muted-foreground">{group.topic}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Team Members:</p>
                <div className="flex -space-x-2">
                  {group.members.map((member, index) => (
                    <Avatar
                      key={index}
                      className="h-8 w-8 border-2 border-background"
                    >
                      <AvatarImage
                        src={`/admin-avatar.png?height=32&width=32&query=${member}`}
                      />
                      <AvatarFallback className="text-xs">
                        {member
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {group.progress}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${group.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
