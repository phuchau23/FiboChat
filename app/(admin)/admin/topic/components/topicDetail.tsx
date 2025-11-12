"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Topic } from "@/lib/api/services/fetchTopic";
import type { MasterTopic } from "@/lib/api/services/fetchMasterTopic";
import { Button } from "@/components/ui/button";

interface TopicDetailModalProps {
  open: boolean;
  topic: Topic | null;
  masterTopic: MasterTopic | null;
  loading: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (topic: Topic) => void;
}

export function TopicDetailModal({
  open,
  topic,
  masterTopic,
  loading,
  onOpenChange,
  onEdit,
}: TopicDetailModalProps) {
  if (!topic) return null;

  const { name, description } = topic;

  const getFallback = (fullName: string) => {
    const parts = fullName.trim().split(" ");
    return (parts.at(-1)?.[0] + parts[0]?.[0]).toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl space-y-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2 mb-3 ">
            Topic Detail
          </DialogTitle>
          <p className="text-lg font-medium text-gray-800">{name}</p>
        </DialogHeader>

        {/* Domain + Master Topic (2 Columns with Divider) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 md:divide-x md:divide-gray-200">
          {/* Assigned Domain */}
          <div className="space-y-1 md:pr-8">
            <p className="text-sm font-medium text-[#FF6B00]">
              Assigned Domain
            </p>

            {loading ? (
              <p className="text-gray-500 text-sm">Loading...</p>
            ) : (
              <p className="font-semibold">
                {masterTopic?.domain?.name ?? "No domain assigned"}
              </p>
            )}
          </div>

          {/* Assigned Master Topic */}
          <div className="space-y-1 md:pl-8">
            <p className="text-sm font-medium text-[#FF6B00]">
              Assigned Master Topic
            </p>

            {loading ? (
              <p className="text-gray-500 text-sm">Loading...</p>
            ) : (
              <p className="font-semibold">
                {masterTopic?.name ?? "No master topic assigned"}
              </p>
            )}
          </div>
        </div>

        {/* Semester */}
        <div className="space-y-1">
          <p className="text-sm font-medium text-[#FF6B00]">Semester</p>
          <p className="leading-relaxed">
            {masterTopic?.semester?.code ?? "No semester assigned"}
          </p>
        </div>

        {/* Assigned Lecturers */}
        <div className="space-y-1">
          <p className="text-sm font-medium text-[#FF6B00]">
            Assigned Lecturers
          </p>

          {loading ? (
            <p className="text-gray-500 italic text-sm">Loading...</p>
          ) : masterTopic?.lecturers?.length ? (
            <div className="flex flex-wrap gap-3">
              {masterTopic.lecturers.map((lecturer) => (
                <div
                  key={lecturer.lecturerId}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
                >
                  <Avatar className="w-7 h-7">
                    <AvatarFallback className="bg-gray-200 text-gray-700 text-xs font-medium">
                      {getFallback(lecturer.fullName)}
                    </AvatarFallback>
                  </Avatar>

                  <span className="text-sm font-medium">
                    {lecturer.fullName}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic text-sm">
              No lecturers assigned.
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-1">
          <p className="text-sm font-medium text-[#FF6B00]">Description</p>
          <p className="leading-relaxed">
            {description || "No description provided."}
          </p>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button type="submit" onClick={() => onEdit(topic)}>
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
