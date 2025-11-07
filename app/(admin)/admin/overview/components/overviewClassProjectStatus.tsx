"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

interface ClassGroupOverviewItem {
  classCode: string;
  lecturerName: string | null;
  groups: {
    groupName: string;
    topicName: string | null;
  }[];
}

interface OverviewClassProjectStatusProps {
  data: ClassGroupOverviewItem[];
}

export function OverviewClassProjectStatus({
  data,
}: OverviewClassProjectStatusProps) {
  return (
    <Card className="border-gray-200 shadow-sm bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900">
          Class Project Topic Status
        </CardTitle>
        <p className="text-sm text-slate-500 mt-1">
          Shows each class with its assigned lecturer and project topic
          selection of groups.
        </p>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {data.length ? (
            data.map((item) => (
              <Collapsible
                key={item.classCode}
                className="border border-slate-300 rounded-lg"
              >
                <div className="flex justify-between items-center p-4">
                  <div>
                    <p className="text-slate-900 font-semibold text-md">
                      Class: {item.classCode}
                    </p>
                    <p className="text-slate-600 text-sm mt-1">
                      Lecturer:{" "}
                      {item.lecturerName ?? (
                        <span className="text-red-500 italic">Unassigned</span>
                      )}
                    </p>
                  </div>

                  <CollapsibleTrigger className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 transition">
                    {item.groups.length} groups
                    <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                  </CollapsibleTrigger>
                </div>

                <CollapsibleContent>
                  <div className="px-4 pb-4 space-y-2 border-t border-slate-200">
                    {item.groups.map((g, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center last:border-none py-2 hover:bg-slate-100"
                      >
                        <span className="text-sm font-medium text-slate-800">
                          {g.groupName}
                        </span>

                        <span
                          className={
                            g.topicName
                              ? "text-sm text-emerald-600 font-medium"
                              : "text-xs text-slate-500 italic"
                          }
                        >
                          {g.topicName ?? "Topic Not Selected"}
                        </span>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))
          ) : (
            <p className="text-center text-sm text-slate-500 py-6 italic">
              No class or group data available.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
