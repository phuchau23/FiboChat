"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState, useEffect, useMemo } from "react";
import { getCookie } from "cookies-next";
import { useTopicsByLecturer } from "@/hooks/useTopic";
import { useFeedbackByLecturer } from "@/hooks/useFeedback";
import { Loader2 } from "lucide-react";

export function OverviewTopicQA() {
  const [lecturerId, setLecturerId] = useState<string>("");

  useEffect(() => {
    const id = getCookie("user-id") as string | undefined;
    if (id) setLecturerId(id);
  }, []);

  const { topics, isLoading: topicsLoading } = useTopicsByLecturer(lecturerId || undefined, 1, 50);
  const { data: feedbackData, isLoading: feedbackLoading } = useFeedbackByLecturer(lecturerId, 1, 1000);

  const chartData = useMemo(() => {
    if (!topics || !feedbackData) return [];

    return topics.map((topic) => {
      const topicFeedbacks = feedbackData.data?.items.filter((f) => f.topic?.id === topic.id) || [];
      const answered = topicFeedbacks.filter((f) => f.answer.content).length;
      const unanswered = topicFeedbacks.filter((f) => !f.answer.content).length;

      return {
        topic: topic.name,
        answered,
        unanswered,
      };
    });
  }, [topics, feedbackData]);

  if (!lecturerId || topicsLoading || feedbackLoading) {
    return (
      <div className="flex justify-center py-10 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Loading data...
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Topic Q&A Status</CardTitle>
        <p className="text-sm text-gray-500">Answered and pending questions per topic.</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData}>
            <XAxis dataKey="topic" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="answered" stroke="#10B981" />
            <Line type="monotone" dataKey="unanswered" stroke="#F59E0B" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
