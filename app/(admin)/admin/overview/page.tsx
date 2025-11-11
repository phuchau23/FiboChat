/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo } from "react";

import useLecturers from "@/hooks/useLecturer";
import useAllClasses from "@/hooks/useClass";
import { useAllTopics } from "@/hooks/useTopic";
import { useAllUsers } from "@/hooks/useUser";
import { useSemesters } from "@/hooks/useSemester";
import { useAllGroups } from "@/hooks/useGroup";

import { OverviewKPICards } from "./components/overviewKpiCards";
import { OverviewClassEngagement } from "./components/overviewClassEngagement";
import { OverviewSemesterStatus } from "./components/overviewSemesterStatus";
import { SemesterStatus } from "@/lib/api/services/fetchSemester";
import { TopicStatus } from "@/lib/api/services/fetchTopic";
import { OverviewClassProjectStatus } from "./components/overviewClassProjectStatus";
import { OverviewLecturerWorkloadLegend } from "./components/overviewLecturerWorkload";
import { OverviewTopicInventory } from "./components/overviewTopicInventory";

export type KPIStats = {
  totalStudents: number;
  studentsTrend?: number;
  totalLecturers: number;
  activeSemesters: number;
  totalClasses: number;
  totalTopics: number;
};

export default function OverviewPage() {
  const page = 1;
  const pageSize = 100;

  const { users, isLoading: l1, isError: e1 } = useAllUsers();
  const { lecturers, isLoading: l2, isError: e2 } = useLecturers();
  const {
    semesters,
    isLoading: l3,
    isError: e3,
  } = useSemesters(page, pageSize);
  const { classes, isLoading: l4, isError: e4 } = useAllClasses();
  const { topics, isLoading: l5, isError: e5 } = useAllTopics();
  const { groups, isLoading: l6, isError: e6 } = useAllGroups();

  const isLoading = l1 || l2 || l3 || l4 || l5 || l6;
  const hasError = e1 || e2 || e3 || e4 || e5 || e6;

  // KPI Summary
  const kpi = useMemo(
    () => ({
      totalStudents: users?.length ?? 0,
      totalLecturers: lecturers?.length ?? 0,
      activeSemesters:
        semesters?.filter(
          (s: any) => String(s.status).toLowerCase() === "active"
        ).length ?? 0,
      totalClasses: classes?.length ?? 0,
      totalTopics: topics?.length ?? 0,
    }),
    [users, lecturers, semesters, classes, topics]
  );

  //Topic Inventory Status
  const topicInventory = useMemo(() => {
    if (!topics || !groups) return [];

    // lấy danh sách topic đã được nhóm chọn
    const assignedTopicIds = new Set(
      groups.filter((g: any) => g.topic !== null).map((g: any) => g.topic.id)
    );

    const available = topics.filter(
      (t) => t.status === TopicStatus.Active && !assignedTopicIds.has(t.id)
    ).length;

    const assigned = topics.filter(
      (t) => t.status === TopicStatus.Active && assignedTopicIds.has(t.id)
    ).length;

    const removed = topics.filter(
      (t) => t.status === TopicStatus.Inactive
    ).length;

    return [
      { label: "Available", count: available, color: "#10B981" }, // xanh lá
      { label: "Assigned", count: assigned, color: "#3B82F6" }, // xanh dương
      { label: "Removed", count: removed, color: "#CBD5E1" }, // xám
    ];
  }, [topics, groups]);

  const unselectedTopics = useMemo(() => {
    if (!topics || !groups) return [];

    const assignedTopicIds = new Set(
      groups.filter((g: any) => g.topic !== null).map((g: any) => g.topic.id)
    );

    return topics
      .filter(
        (t) => t.status === TopicStatus.Active && !assignedTopicIds.has(t.id)
      )
      .map((t) => ({
        id: t.id,
        name: t.name,
        masterTopicName: t.masterTopic?.name ?? null,
      }));
  }, [topics, groups]);

  const classEngagement = useMemo(() => {
    if (!groups.length) return [];

    const map = new Map<
      string,
      {
        classCode: string;
        groups: { groupName: string; topicName: string | null }[];
      }
    >();

    groups.forEach((g: any) => {
      const classCode = g.class?.code ?? "Unknown";
      const groupName = g.name;
      const topicName = g.topic?.name ?? null;

      if (!map.has(classCode)) {
        map.set(classCode, { classCode, groups: [{ groupName, topicName }] });
      } else {
        map.get(classCode)!.groups.push({ groupName, topicName });
      }
    });

    return [...map.values()].map((item) => ({
      classCode: item.classCode,
      groups: item.groups,
      selected: item.groups.filter((g) => g.topicName !== null).length,
      total: item.groups.length,
    }));
  }, [groups]);

  const lecturerWorkload = useMemo(() => {
    if (!classes) return [];
    const classCount = new Map<string, number>();

    classes.forEach((c: any) => {
      const lid = c?.lecturer?.id;
      if (!lid) return;
      classCount.set(lid, (classCount.get(lid) ?? 0) + 1);
    });

    // map id → name từ lecturers
    const nameById = new Map<string, string>();
    (lecturers ?? []).forEach((l: any) => {
      const id = String(l?.lecturerId ?? l?.id);
      const name = l?.fullName ?? l?.name ?? "Unknown";
      nameById.set(id, name);
    });

    return Array.from(classCount.entries()).map(
      ([LecturerID, ClassesAssigned]) => ({
        LecturerID,
        LecturerName:
          nameById.get(String(LecturerID)) ?? `Lecturer ${LecturerID}`,
        ClassesAssigned,
      })
    );
  }, [classes, lecturers]);

  // Semester Status
  const semesterStatus = useMemo(() => {
    if (!semesters) return [];

    return semesters.map((s: any) => ({
      semesterId: s.id,
      semesterName: s.code ?? s.name,
      startDate: s.startDate,
      endDate: s.endDate,
      status:
        s.status === SemesterStatus.Active
          ? ("Active" as const)
          : ("Inactive" as const),
    }));
  }, [semesters]);

  // Recent Class & Group Overview
  const classGroupOverview = useMemo(() => {
    if (!groups.length) return [];

    const map = new Map<
      string,
      {
        classCode: string;
        lecturerName: string | null;
        groups: { groupName: string; topicName: string | null }[];
      }
    >();

    groups.forEach((g: any) => {
      const classCode = g.class?.code ?? "Unknown";
      const lecturerName = g.class?.lecturer?.fullName ?? null;
      const groupName = g.name;
      const topicName = g.topic?.name ?? null;

      if (!map.has(classCode)) {
        map.set(classCode, {
          classCode,
          lecturerName,
          groups: [{ groupName, topicName }],
        });
      } else {
        map.get(classCode)!.groups.push({ groupName, topicName });
      }
    });

    return Array.from(map.values());
  }, [groups]);

  if (isLoading)
    return (
      <div className="text-center py-8 text-slate-600">
        Loading dashboard...
      </div>
    );
  if (hasError)
    return (
      <div className="text-center py-8 text-red-500">
        Failed to load dashboard data
      </div>
    );

  return (
    <div className="space-y-6">
      <OverviewKPICards stats={kpi} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <OverviewTopicInventory
          data={topicInventory}
          unselected={unselectedTopics}
        />
        <OverviewLecturerWorkloadLegend data={lecturerWorkload} />
      </div>
      <OverviewClassEngagement data={classEngagement} />

      <OverviewSemesterStatus data={semesterStatus} />
      <OverviewClassProjectStatus data={classGroupOverview} />
    </div>
  );
}
