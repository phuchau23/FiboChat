"use client";

import { useState } from "react";
import { Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { UnselectedTopicModal } from "./unSelectedTopicModal";

interface TopicInventoryItem {
  label: string; // "Available" | "Assigned" | "Removed"
  count: number;
  color: string;
}

interface Props {
  data: TopicInventoryItem[];
  unselected: { id: string; name: string; masterTopicName: string | null }[];
}

export function OverviewTopicInventory({ data, unselected }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const total = data.reduce((sum, item) => sum + item.count, 0);

  const chartData = data.map((item) => ({
    key: item.label,
    name: item.label,
    value: item.count,
    fill: item.color,
  }));

  const chartConfig: ChartConfig = {
    value: { label: "Topics" },
    ...Object.fromEntries(
      chartData.map((it) => [it.key, { label: it.name, color: it.fill }])
    ),
  };

  return (
    <Card className="flex flex-col bg-white">
      <CardHeader className="items-center pb-0">
        <CardTitle>Topic Inventory</CardTitle>
        <CardDescription>Identify unused and popular topics</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) =>
                    `${value} topics (${(
                      ((value as number) / total) *
                      100
                    ).toFixed(1)}%)`
                  }
                />
              }
            />

            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              onMouseEnter={(_, idx) => setActiveIndex(idx)}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <Sector {...props} outerRadius={outerRadius + 10} />
              )}
            />

            <ChartLegend
              content={<ChartLegendContent nameKey="key" />}
              className="mt-3 flex-wrap gap-2 *:basis-1/3 *:justify-center *:whitespace-nowrap"
            />
          </PieChart>
        </ChartContainer>

        {unselected.length > 0 && (
          <div className="mt-4 text-sm text-slate-600">
            <span className="font-medium text-slate-900">
              Topics not chosen:
            </span>
            <ul className="grid grid-cols-3 gap-y-1 ml-5 mt-1 list-disc">
              {unselected.slice(0, 6).map((t) => (
                <li key={t.id} className="whitespace-nowrap">
                  {t.name}
                </li>
              ))}
            </ul>
            <div className="mt-1 flex justify-end">
              <button
                onClick={() => setShowModal(true)}
                className="text-gray-600 hover:text-black hover:underline text-xs font-medium"
              >
                View all ({unselected.length})
              </button>
            </div>
          </div>
        )}

        <UnselectedTopicModal
          open={showModal}
          onClose={() => setShowModal(false)}
          topics={unselected}
        />
      </CardContent>
    </Card>
  );
}
