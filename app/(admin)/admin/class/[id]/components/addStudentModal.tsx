"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useAddStudentsToClass,
  useStudentsWithoutClass,
} from "@/hooks/useClass";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/utils/error";

interface AddStudentModalProps {
  open: boolean;
  classId: string;
  onOpenChange: (open: boolean) => void;
}

export function AddStudentModal({
  open,
  classId,
  onOpenChange,
}: AddStudentModalProps) {
  const { toast } = useToast();
  const { studentsData, isLoading } = useStudentsWithoutClass();
  const addStudentMutation = useAddStudentsToClass();

  const students = studentsData ?? [];

  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const filteredStudents = students.filter((s) => {
    const fullName = `${s.firstname} ${s.lastname}`.toLowerCase();
    return (
      fullName.includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.studentID ?? "").toLowerCase().includes(search.toLowerCase())
    );
  });

  const toggleSelect = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const allIds = filteredStudents.map((s) => s.id);
  const isAllSelected = selectedStudents.length === allIds.length;

  const toggleSelectAll = () => {
    setSelectedStudents(isAllSelected ? [] : allIds);
  };

  const handleSubmit = () => {
    if (selectedStudents.length === 0) return;

    addStudentMutation.mutate(
      { classId, userIds: selectedStudents },
      {
        onSuccess: () => {
          toast({
            title: "Success notification!",
            description: `${selectedStudents.length} student have been successfully added to the class.`,
          });

          setSelectedStudents([]);
          onOpenChange(false);
        },
        onError: (err: unknown) => {
          const message = getErrorMessage(
            err,
            "Failed to add students. Please try again."
          );

          toast({
            title: "Oops! Something went wrong",
            description: message,
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add Students to Class</DialogTitle>
          <DialogDescription>Select one or more students</DialogDescription>
        </DialogHeader>

        {/* Search Input */}
        <Input
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-3"
        />

        <div className="flex items-center gap-2 mb-3">
          <Checkbox checked={isAllSelected} onCheckedChange={toggleSelectAll} />
          <span
            className="text-sm font-medium cursor-pointer"
            onClick={toggleSelectAll}
          >
            Select All
          </span>
        </div>

        <ScrollArea className="h-[300px] border rounded-lg p-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading...
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No students found
            </div>
          ) : (
            <div className="space-y-2">
              {filteredStudents.map((student) => (
                <label
                  key={student.id}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted cursor-pointer"
                >
                  <Checkbox
                    checked={selectedStudents.includes(student.id)}
                    onCheckedChange={() => toggleSelect(student.id)}
                  />

                  <Avatar className="h-8 w-8">
                    <AvatarImage src={"/placeholder.svg"} />
                    <AvatarFallback>
                      {student.firstname.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="font-medium text-sm">
                      {student.firstname} {student.lastname} -{" "}
                      {student.studentID}
                    </p>
                    <p className="text-xs text-muted-foreground pt-1">
                      {student.email}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              selectedStudents.length === 0 || addStudentMutation.isPending
            }
          >
            {addStudentMutation.isPending ? "Adding..." : "Add Student"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
