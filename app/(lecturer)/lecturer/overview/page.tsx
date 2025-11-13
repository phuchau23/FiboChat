"use client";
import React, { useEffect, useState } from "react";
import { OverviewClassStats } from "./components/OverviewClassStats";
import { OverviewTopicQA } from "./components/OverviewTopicQA";
import { OverviewDocumentsByTopic } from "./components/OverviewDocuments";
import { getCookie } from "cookies-next";
import { OverviewTopicsBySemester } from "./components/OverviewTopicsBySemester";

export default function OverviewPage() {
  const [lecturerId, setLecturerId] = useState<string | null>(null);

  useEffect(() => {
    const id = getCookie("user-id") as string | undefined;
    if (id) setLecturerId(id);
  }, []);

  return (
    <section className="p-6 md:p-10 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-[#fa7a1c] to-orange-400 bg-clip-text text-transparent">
          Lecturer Overview
        </h2>
        <p className="mt-2 text-gray-600 max-w-2xl">Track classes, topics, feedback and AI interactions at a glance.</p>
      </div>

      {/* Row 1: Classes & Engagement */}
      <div className="grid md:grid-cols-2 gap-6">
        <OverviewClassStats />
        {lecturerId && <OverviewDocumentsByTopic lecturerId={lecturerId} />}
      </div>

      {/* Row 2: Q&A and Feedback */}
      {/* Row 2: Q&A and Feedback */}
      <div className="grid md:grid-cols-2 gap-6">
        {lecturerId && <OverviewTopicsBySemester lecturerId={lecturerId} />}
        <OverviewTopicQA />
      </div>
    </section>
  );
}
