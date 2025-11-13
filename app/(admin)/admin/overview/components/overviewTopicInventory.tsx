"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { OverviewGroup } from "@/lib/api/services/fetchGroup";
import { Topic, TopicStatus } from "@/lib/api/services/fetchTopic";

interface TopicInventoryItem {
  label: string;
  count: number;
  color: string;
}

interface Semester {
  id: string;
  code: string;
  name?: string;
}

interface Props {
  data: TopicInventoryItem[];
  groups?: OverviewGroup[];
  semesters?: Semester[];
  topics?: Topic[];
}

export function OverviewTopicInventory({
  data,
  groups,
  semesters,
  topics,
}: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string | "all">(
    "all"
  );

  // 🧩 Lọc groups theo semester
  const filteredGroups = useMemo(() => {
    if (!groups) return [];
    if (selectedSemester === "all") return groups;
    return groups.filter((g) => g.class?.semester?.id === selectedSemester);
  }, [groups, selectedSemester]);

  // 🧮 Recalculate inventory based on semester
  const semesterInventory = useMemo(() => {
    if (!topics || !groups) return data;

    const assignedTopicIds = new Set(
      filteredGroups.filter((g) => g.topic !== null).map((g) => g.topic!.id)
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
      { label: "Available", count: available, color: "#10B981" },
      { label: "Assigned", count: assigned, color: "#3B82F6" },
      { label: "Removed", count: removed, color: "#CBD5E1" },
    ];
  }, [topics, filteredGroups]);

  // 🧮 Trend change
  const trendChange = useMemo(() => {
    if (!filteredGroups.length) return { assigned: 0, available: 0 };

    const currentAssigned = filteredGroups.filter((g) => g.topic).length;
    const prevAssigned = groups
      ? groups.filter(
          (g) =>
            g.topic &&
            g.class?.semester?.id !== selectedSemester &&
            g.class?.semester?.id
        ).length
      : 0;

    const assignedChange =
      prevAssigned === 0
        ? currentAssigned > 0
          ? 100
          : 0
        : ((currentAssigned - prevAssigned) / prevAssigned) * 100;

    return {
      assigned: assignedChange,
      available: -assignedChange,
    };
  }, [filteredGroups, groups, selectedSemester]);

  const total = semesterInventory.reduce((sum, item) => sum + item.count, 0);
  const chartData = semesterInventory.map((item) => ({
    name: item.label,
    count: item.count,
    percentage: total > 0 ? ((item.count / total) * 100).toFixed(1) : "0",
    fill: item.color,
  }));

  const getTrendIcon = (value: number) => {
    if (value > 0)
      return (
        <TrendingUp className="text-emerald-600 w-4 h-4 inline-block ml-1" />
      );
    if (value < 0)
      return (
        <TrendingDown className="text-red-500 w-4 h-4 inline-block ml-1" />
      );
    return null;
  };

  return (
    <Card className="h-full flex flex-cols bg-white">
      <CardHeader className="pb-3 flex justify-between items-center">
        <div>
          <CardTitle>Topic Inventory Overview</CardTitle>
          <CardDescription>
            {selectedSemester === "all"
              ? "Overview across all semesters"
              : `Semester: ${
                  semesters?.find((s) => s.id === selectedSemester)?.code
                }`}
          </CardDescription>
        </div>

        {/* Dropdown chọn kỳ học */}
        <Select
          value={selectedSemester}
          onValueChange={(v) => setSelectedSemester(v)}
        >
          <SelectTrigger className="w-[180px] border-2">
            <SelectValue placeholder="Select Semester" />
          </SelectTrigger>
          <SelectContent className="bg-white shadow-lg border border-slate-200">
            <SelectItem value="all">All Semesters</SelectItem>
            {semesters?.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.code ?? s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="flex-1">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {chartData.map((item, index) => {
            const change =
              item.name === "Assigned"
                ? trendChange.assigned
                : item.name === "Available"
                ? trendChange.available
                : 0;

            return (
              <div
                key={item.name}
                className="flex flex-col p-4 rounded-xl border-2 hover:shadow-lg transition-all duration-300 cursor-pointer"
                style={{
                  borderColor: item.fill,
                  backgroundColor: `${item.fill}08`,
                }}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900">
                    {item.count}
                  </span>
                  <span className="text-sm font-medium text-slate-500">
                    ({item.percentage}%)
                  </span>
                </div>
                {item.name !== "Removed" && (
                  <div className="text-xs mt-1 font-semibold">
                    {change === 0 ? (
                      <span className="text-slate-400">No change</span>
                    ) : change > 0 ? (
                      <span className="text-emerald-600">
                        +{change.toFixed(1)}%{getTrendIcon(change)}
                      </span>
                    ) : (
                      <span className="text-red-500">
                        {change.toFixed(1)}%{getTrendIcon(change)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bar Chart */}
        <div className="h-[240px] w-full mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 20, left: 20, bottom: 40 }}
              onMouseMove={(state) => {
                if (state.isTooltipActive) {
                  setActiveIndex(state.activeTooltipIndex ?? null);
                }
              }}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fill: "#64748b", fontSize: 13, fontWeight: 500 }}
                axisLine={{ stroke: "#cbd5e1" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#64748b", fontSize: 12 }}
                axisLine={{ stroke: "#cbd5e1" }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.98)",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                  padding: "12px 16px",
                }}
                cursor={{ fill: "rgba(148, 163, 184, 0.1)" }}
              />
              <Legend />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={100}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fill}
                    opacity={
                      activeIndex === null || activeIndex === index ? 1 : 0.4
                    }
                    className="transition-opacity duration-300"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
