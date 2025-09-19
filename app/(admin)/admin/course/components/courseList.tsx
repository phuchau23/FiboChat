"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Calendar, Clock } from "lucide-react";

export default function CourseList() {
  const courses = [
    {
      id: "SWP392-HCM-01",
      name: "Software Engineering Project",
      campus: "Ho Chi Minh",
      instructor: "Dr. Nguyen Van Minh",
      students: 120,
      groups: 24,
      semester: "Spring 2024",
      status: "active",
    },
    {
      id: "SWP392-HN-02",
      name: "Software Engineering Project",
      campus: "Hanoi",
      instructor: "Prof. Tran Thi Lan",
      students: 100,
      groups: 20,
      semester: "Spring 2024",
      status: "active",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Course Management
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage SWP392 course sections, assignments, and academic schedules.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    {course.name}
                  </CardTitle>
                  <CardDescription>
                    {course.id} • {course.campus} Campus
                  </CardDescription>
                </div>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{course.students} Students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{course.groups} Groups</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{course.semester}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">15 weeks</span>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground mb-2">
                    Instructor:
                  </p>
                  <p className="font-medium">{course.instructor}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  <Button size="sm">Manage</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
