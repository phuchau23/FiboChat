import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import { useFeedbackByLecturer } from "@/hooks/useFeedback";

interface OverviewFeedbackProps {
  lecturerId: string;
  search?: string;
  filterTopicId?: string | null;
}

export function OverviewFeedback({ lecturerId, search, filterTopicId }: OverviewFeedbackProps) {
  const { data, isLoading, isError } = useFeedbackByLecturer(lecturerId, 1, 1000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const feedbacks = data?.data?.items ?? [];

  const filtered = useMemo(() => {
    return feedbacks.filter((fb) => {
      const matchTopic = filterTopicId ? fb.topic?.id === filterTopicId : true;
      const s = search?.toLowerCase() || "";
      const matchSearch =
        fb.user.firstName.toLowerCase().includes(s) ||
        fb.user.lastName.toLowerCase().includes(s) ||
        fb.answer.content.toLowerCase().includes(s) ||
        (fb.comment?.toLowerCase().includes(s) ?? false) ||
        (fb.topic?.name?.toLowerCase().includes(s) ?? false);
      return matchTopic && matchSearch;
    });
  }, [feedbacks, filterTopicId, search]);

  const { helpful, notHelpful, total, helpfulPercent } = useMemo(() => {
    const helpful = filtered.filter((fb) => (fb.helpful ?? "").toLowerCase().includes("helpful")).length;
    const notHelpful = filtered.length - helpful;
    const total = filtered.length;
    const helpfulPercent = total > 0 ? (helpful / total) * 100 : 0;
    return { helpful, notHelpful, total, helpfulPercent };
  }, [filtered]);

  const pieData = [
    { name: "Helpful", value: helpful },
    { name: "Not Helpful", value: notHelpful },
  ];

  const COLORS = ["#10B981", "#EF4444"]; // Xanh: Helpful, Đỏ: Not

  if (!lecturerId || isLoading) {
    return (
      <div className="flex justify-center py-10 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Loading...
      </div>
    );
  }

  if (isError) {
    return <div className="text-center py-6 text-red-500">Failed to load.</div>;
  }

  if (total === 0) {
    return <div className="text-center py-6 text-gray-500">No feedback available.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Feedback Summary</CardTitle>
        <p className="text-sm text-gray-500">Based on student ratings</p>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              startAngle={90}
              endAngle={-270}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>

            {/* Số liệu trung tâm */}
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-3xl font-bold fill-gray-800"
            >
              {helpfulPercent.toFixed(0)}%
            </text>
            <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" className="text-xs fill-gray-500">
              Helpful
            </text>
          </PieChart>
        </ResponsiveContainer>

        {/* Legend bên dưới */}
        <div className="flex gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Helpful ({helpful})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Not Helpful ({notHelpful})</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
