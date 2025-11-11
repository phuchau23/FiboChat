"use client";

import { useEffect, useState } from "react";
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

  const classData = students?.[0];
  const studentList = classData?.students ?? [];

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );

  const selectedStudent =
    studentList.find((s) => s.id === selectedStudentId) ?? null;

  //Search state + Debounce
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300); // Debounce 300ms
    return () => clearTimeout(timer);
  }, [search]);

  // Highlight function
  function highlight(text: string, query: string) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, `<mark class="bg-yellow-200">$1</mark>`);
  }

  // Filter using debouncedSearch
  const filteredStudents = studentList.filter((s) => {
    const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
    return (
      fullName.includes(debouncedSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      (s.id ?? "").toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  });

  const handleRemoveStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    setIsRemoveOpen(true);
  };

  return (
    <>
      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Enrolled Students: {studentList.length}</CardTitle>
          <Button onClick={() => setIsAddOpen(true)} size="sm">
            Add Student
          </Button>
        </CardHeader>

        <CardContent>
          {/*Search UI */}
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm mb-4"
          />

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading students...
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No students found
            </div>
          ) : (
            <div className="space-y-3">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 bg-gray-200">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>
                        {student.firstName.charAt(0)}
                        {student.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      {/*Highlight Name */}
                      <p
                        className="font-medium text-sm"
                        dangerouslySetInnerHTML={{
                          __html: highlight(
                            `${student.firstName} ${student.lastName}`,
                            debouncedSearch
                          ),
                        }}
                      />

                      {/* Highlight Email */}
                      <p
                        className="text-xs text-muted-foreground"
                        dangerouslySetInnerHTML={{
                          __html: highlight(student.email, debouncedSearch),
                        }}
                      />
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

      {/* Modal Add */}
      <AddStudentModal
        open={isAddOpen}
        classId={classId}
        onOpenChange={setIsAddOpen}
      />

      {/* Dialog Remove */}
      <RemoveStudentDialog
        open={isRemoveOpen}
        classId={classId}
        selectedStudent={selectedStudent}
        onOpenChange={setIsRemoveOpen}
      />
    </>
  );
}
