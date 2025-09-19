"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus, Plus } from "lucide-react";
import { Teacher } from "../page";

interface Props {
  onAdd: (teacher: Teacher) => void;
}

export default function AddTeacherDialog({ onAdd }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: "",
    phone: "",
    campus: "",
    department: "Software Engineering",
  });

  const handleSubmit = () => {
    const teacher: Teacher = {
      id: Date.now().toString(),
      ...newTeacher,
      status: "pending",
      coursesAssigned: 0,
      joinDate: new Date().toISOString().split("T")[0],
    };
    onAdd(teacher);
    setNewTeacher({
      name: "",
      email: "",
      phone: "",
      campus: "",
      department: "Software Engineering",
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> Add Teacher
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Teacher</DialogTitle>
          <DialogDescription>
            Fill the form to add a new SWP392 instructor.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={newTeacher.name}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, name: e.target.value })
              }
              className="col-span-3"
              placeholder="Dr. John Doe"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={newTeacher.email}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, email: e.target.value })
              }
              className="col-span-3"
              placeholder="john.doe@fpt.edu.vn"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone
            </Label>
            <Input
              id="phone"
              value={newTeacher.phone}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, phone: e.target.value })
              }
              className="col-span-3"
              placeholder="+84 901 234 567"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="campus" className="text-right">
              Campus
            </Label>
            <Select
              value={newTeacher.campus}
              onValueChange={(v) => setNewTeacher({ ...newTeacher, campus: v })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select campus" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ho Chi Minh">Ho Chi Minh</SelectItem>
                <SelectItem value="Hanoi">Hanoi</SelectItem>
                <SelectItem value="Da Nang">Da Nang</SelectItem>
                <SelectItem value="Can Tho">Can Tho</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>
            <UserPlus className="w-4 h-4 mr-2" /> Add Teacher
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
