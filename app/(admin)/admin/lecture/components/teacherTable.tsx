"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Teacher } from "../page";
import TeacherRow from "./teacherRow";

export default function TeacherTable({ teachers }: { teachers: Teacher[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Teacher</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Campus</TableHead>
          <TableHead>Courses</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Join Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {teachers.map((t) => (
          <TeacherRow key={t.id} teacher={t} />
        ))}
      </TableBody>
    </Table>
  );
}
