"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TeacherTable from "./teacherTable";
import { Teacher } from "../page";

export default function TeacherDirectory({
  teachers,
}: {
  teachers: Teacher[];
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = teachers.filter(
    (t) =>
      (t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.email.toLowerCase().includes(search.toLowerCase()) ||
        t.campus.toLowerCase().includes(search.toLowerCase())) &&
      (status === "all" || t.status === status)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Teacher Directory</CardTitle>
        <CardDescription>Search and manage instructors</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search teachers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-background border border-gray-300 rounded-md
             focus:border-primary focus:ring-1 focus:ring-primary
             transition-colors"
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger
              className="w-[180px] bg-background border border-gray-300 rounded-md
               text-sm placeholder:text-muted-foreground
               focus:border-primary focus:ring-1 focus:ring-primary
               shadow-sm"
            >
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-background border border-gray-200 rounded-md shadow-lg">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <TeacherTable teachers={filtered} />
      </CardContent>
    </Card>
  );
}
