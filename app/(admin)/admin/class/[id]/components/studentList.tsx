"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2 } from "lucide-react";

import { useStudentsByClassId } from "@/hooks/useClass";
import { RemoveStudentDialog } from "./deleteStudentDialog";
import { AddStudentModal } from "./addStudentModal";

interface StudentListProps {
  classId: string;
}

export function StudentList({ classId }: StudentListProps) {
  const { students, isLoading } = useStudentsByClassId(classId);

  const classData = students?.[0]; // vì API trả về mảng -> lấy phần tử duy nhất
  const studentList = classData?.students ?? [];

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const selectedStudent =
    studentList.find((s) => s.id === selectedStudentId) ?? null;

  const handleRemoveStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    setIsRemoveOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Enrolled Students: {studentList.length}</CardTitle>
          <Button onClick={() => setIsAddOpen(true)} size="sm">
            Add Student
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading students...
            </div>
          ) : studentList.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No students enrolled yet
            </div>
          ) : (
            <div className="space-y-3">
              {studentList.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={"/placeholder.svg"}
                        alt={student.firstName + " " + student.lastName}
                      />
                      <AvatarFallback>
                        {student.firstName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {student.email}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveStudent(student.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddStudentModal
        open={isAddOpen}
        classId={classId}
        onOpenChange={setIsAddOpen}
      />

      <RemoveStudentDialog
        open={isRemoveOpen}
        classId={classId}
        selectedStudent={selectedStudent}
        onOpenChange={setIsRemoveOpen}
      />
    </>
  );
}