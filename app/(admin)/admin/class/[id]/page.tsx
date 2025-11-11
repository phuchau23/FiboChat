"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useClassById, useStudentsByClassId } from "@/hooks/useClass";
import { StudentList } from "./components/studentList";

export default function ClassDetailPage() {
  const router = useRouter();
  const params = useParams();
  const classId = params.id as string;

  const { class: classData, isLoading: classLoading } = useClassById(classId);
  const { isLoading: studentsLoading } = useStudentsByClassId(classId);

  if (classLoading || studentsLoading) {
    return (
      <div className="text-center py-12 text-muted-foreground">Loading...</div>
    );
  }

  // Nếu không tìm thấy lớp
  if (!classData) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Class not found</p>
        </div>
      </div>
    );
  }

  const { code, lecturer, semester } = classData;

  return (
    <div className="space-y-6">
      <Button
        variant="outline"
        className="hover:bg-[#FF6B00] hover:text-white hover:border-none border-gray-300"
        onClick={() => router.back()}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Classes
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border-2 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium text-gray-500">
              Class Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{code}</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-2 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium text-gray-500">
              Semester
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{semester?.code || "N/A"}</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-2 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium text-gray-500">
              Lecturer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{lecturer?.fullName || "N/A"}</p>
          </CardContent>
        </Card>
      </div>

      <StudentList classId={classId} />
    </div>
  );
}
