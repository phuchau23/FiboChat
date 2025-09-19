"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Mail, Phone, MoreHorizontal } from "lucide-react";
import { Teacher } from "../page";

export default function TeacherRow({ teacher }: { teacher: Teacher }) {
  const getStatusBadge = (status: Teacher["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`/admin-avatar.png?query=${teacher.name}`} />
            <AvatarFallback>
              {teacher.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{teacher.name}</div>
            <div className="text-sm text-muted-foreground">
              {teacher.department}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="w-3 h-3" />
            {teacher.email}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="w-3 h-3" />
            {teacher.phone}
          </div>
        </div>
      </TableCell>
      <TableCell>{teacher.campus}</TableCell>
      <TableCell>
        <Badge variant="outline">{teacher.coursesAssigned} courses</Badge>
      </TableCell>
      <TableCell>{getStatusBadge(teacher.status)}</TableCell>
      <TableCell>{teacher.joinDate}</TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
