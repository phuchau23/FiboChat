"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { MasterTopic } from "@/lib/api/services/fetchMasterTopic";

interface MasterTopicDetailModalProps {
  open: boolean;
  masterTopic: MasterTopic | null;
  onOpenChange: (open: boolean) => void;
}

export function MasterTopicDetailModal({
  open,
  masterTopic,
  onOpenChange,
}: MasterTopicDetailModalProps) {
  if (!masterTopic) return null;

  const { name, domain, lecturers, description, createdAt } = masterTopic;

  function getFallback(fullName: string) {
    const parts = fullName.trim().split(" ");
    return (parts.at(-1)?.[0] + parts[0]?.[0]).toUpperCase();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl space-y-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 mb-2">
            Master Topic Detail
          </DialogTitle>
          <p className="font-semibold text-lg">{name}</p>
        </DialogHeader>

        {/* Title + Subtitle */}
        <div className="space-y-1">
          <p className="text-sm font-medium text-[#FF6B00]">Domain</p>
          <p className="font-semibold text-lg">{domain?.name || "No domain"}</p>
        </div>

        {/* Description Block */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-[#FF6B00]">Description</p>
          <div className="font-semibold leading-relaxed">
            {description || "No description provided."}
          </div>
        </div>

        {/* Lecturers */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-[#FF6B00]">
            Assigned Lecturers
          </p>

          {lecturers?.length ? (
            <div className="flex flex-wrap gap-3">
              {lecturers.map((lecturer) => (
                <div
                  key={lecturer.lecturerId}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
                >
                  <Avatar className="w-7 h-7">
                    <AvatarImage src={"/placeholder.svg"} />
                    <AvatarFallback className="bg-gray-200 text-gray-700 text-xs font-medium rounded-full">
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
            <p className="text-sm text-gray-500 italic">
              No lecturers assigned
            </p>
          )}
        </div>

        {/* Metadata Footer */}
        <DialogFooter className="pt-4 border-t border-gray-300 text-sm text-gray-700">
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
