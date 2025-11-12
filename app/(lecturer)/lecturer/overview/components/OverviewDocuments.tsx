"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useDocumentsAll } from "@/hooks/useDocuments";
import { useEffect, useState } from "react";

interface OverviewDocumentsByTopicProps {
  lecturerId: string;
}

export function OverviewDocumentsByTopic({}: OverviewDocumentsByTopicProps) {
  const { data: allDocsData, isLoading } = useDocumentsAll(1, 1000); // lấy tất cả docs
  const [chartData, setChartData] = useState<{ topic: string; value: number }[]>([]);

  useEffect(() => {
    if (!allDocsData?.documents) return;

    const activeDocs = allDocsData.documents.filter((doc) => doc.status !== "Inactive");

    // Tính số lượng theo topic
    const counts: Record<string, number> = {};
    activeDocs.forEach((doc) => {
      const topicName = doc.topic?.name || "No Topic";
      counts[topicName] = (counts[topicName] || 0) + 1;
    });

    setChartData(Object.entries(counts).map(([topic, value]) => ({ topic, value })));
  }, [allDocsData]);

  if (isLoading) return <p>Loading documents overview by topic...</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents by Topic</CardTitle>
        <p className="text-sm text-gray-500">Number of documents for each topic.</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
            <XAxis
              dataKey="topic"
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fontSize: 12, fill: "#666" }}
              interval={0}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" radius={8} fill="#fa7a1c" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
