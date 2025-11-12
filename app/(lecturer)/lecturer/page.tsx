"use client";

import { useState } from "react";
import Overview from "./overview/page";
import TopicTable from "./topic/page";
import ClassTable from "./class/page";
import CourseDocument from "./course/page";
import FeedbackTable from "./feedback/page";

export default function Page() {
  const [sidebarKey] = useState("overview");

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "20px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        padding: "32px",
        minHeight: "calc(100vh - 160px)",
        transition: "all 0.3s ease",
      }}
    >
      {sidebarKey === "overview" && <Overview />}
      {sidebarKey === "topic" && <TopicTable />}
      {sidebarKey === "class" && <ClassTable />}
      {sidebarKey === "course" && <CourseDocument />}
      {sidebarKey === "feedback" && <FeedbackTable />}
    </div>
  );
}
