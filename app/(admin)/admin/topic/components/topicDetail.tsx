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

interface TopicDetailModalProps {
  open: boolean;
  topic: Topic | null;
  masterTopic: MasterTopic | null;
  loading: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TopicDetailModal({
  open,
  topic,
  masterTopic,
  loading,
  onOpenChange,
}: TopicDetailModalProps) {
  if (!topic) return null;

  const { name, description, createdAt } = topic;

  const getFallback = (fullName: string) => {
    const parts = fullName.trim().split(" ");
    return (parts.at(-1)?.[0] + parts[0]?.[0]).toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl space-y-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Topic Detail
          </DialogTitle>
          <p className="text-lg font-medium text-gray-800">{name}</p>
        </DialogHeader>

        {/* Domain */}
        <div className="space-y-1">
          <p className="text-sm font-medium text-[#FF6B00]">Assigned Domain</p>

          {loading ? (
            <p className="text-gray-500 italic text-sm">Loading...</p>
          ) : (
            <p className="font-semibold">
              {masterTopic?.domain?.name ?? "No domain assigned"}
            </p>
          )}
        </div>

        {/* Master Topic */}
        <div className="space-y-1">
          <p className="text-sm font-medium text-[#FF6B00]">
            Assigned Master Topic
          </p>

          {loading ? (
            <p className="text-gray-500 italic text-sm">Loading...</p>
          ) : (
            <p className="font-semibold">{masterTopic?.name ?? "N/A"}</p>
          )}
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

        <DialogFooter className="pt-4 border-t text-sm text-gray-600">
          Created:{" "}
          {new Date(createdAt).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
