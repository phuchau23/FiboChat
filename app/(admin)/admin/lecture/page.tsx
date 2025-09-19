"use client";

import { useState } from "react";
import TeacherDirectory from "./components/teacherDirectory";
import AddTeacherDialog from "./components/addTeacherDialog";

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  campus: string;
  department: string;
  status: string;
  coursesAssigned: number;
  joinDate: string;
}

const initial: Teacher[] = [
  {
    id: "1",
    name: "Dr. Nguyen Van Minh",
    email: "minh.nv@fpt.edu.vn",
    phone: "+84 901 234 567",
    campus: "Ho Chi Minh",
    department: "Software Engineering",
    status: "active",
    coursesAssigned: 3,
    joinDate: "2023-01-15",
  },
  {
    id: "2",
    name: "Prof. Tran Thi Lan",
    email: "lan.tt@fpt.edu.vn",
    phone: "+84 902 345 678",
    campus: "Hanoi",
    department: "Software Engineering",
    status: "active",
    coursesAssigned: 2,
    joinDate: "2022-08-20",
  },
  {
    id: "3",
    name: "Dr. Le Hoang Nam",
    email: "nam.lh@fpt.edu.vn",
    phone: "+84 903 456 789",
    campus: "Da Nang",
    department: "Software Engineering",
    status: "pending",
    coursesAssigned: 0,
    joinDate: "2024-01-10",
  },
  {
    id: "4",
    name: "MSc. Pham Thi Hoa",
    email: "hoa.pt@fpt.edu.vn",
    phone: "+84 904 567 890",
    campus: "Can Tho",
    department: "Software Engineering",
    status: "active",
    coursesAssigned: 1,
    joinDate: "2023-06-12",
  },
];

export default function TeacherManagement() {
  const [teachers, setTeachers] = useState<Teacher[]>(initial);

  const handleAdd = (teacher: Teacher) => setTeachers([...teachers, teacher]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Teacher Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage SWP392 instructors across campuses.
          </p>
        </div>
        <AddTeacherDialog onAdd={handleAdd} />
      </div>
      <TeacherDirectory teachers={teachers} />
    </div>
  );
}
