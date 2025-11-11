"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { School } from "lucide-react";

interface ClassEngagementModalProps {
  open: boolean;
  onClose: () => void;
  classCode: string | null;
  groups: { groupName: string; topicName: string | null }[];
}

export function ClassEngagementModal({
  open,
  onClose,
  classCode,
  groups,
}: ClassEngagementModalProps) {
  if (!classCode) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95%] max-w-2xl p-4 sm:p-6">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-full">
              <School className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <DialogTitle className="text-lg sm:text-xl font-semibold">
                {classCode}
              </DialogTitle>
              <p className="text-sm text-slate-500">
                Topic selection status for all project groups in this class.
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="mt-6 min-h-[200px] space-y-3">
          {groups.map((g, index) => (
            <div
              key={index}
              className="
          flex flex-col sm:flex-row sm:items-center sm:justify-between
          gap-2 sm:gap-4
          rounded-lg px-4 py-3 border bg-slate-50
        "
            >
              <span className="font-medium text-slate-800 text-base sm:text-sm">
                {g.groupName}
              </span>

              {g.topicName ? (
                <span className="text-slate-600 text-sm">{g.topicName}</span>
              ) : (
                <span className="text-amber-600 bg-amber-100 px-2 py-1 text-xs rounded w-fit">
                  Not Selected
                </span>
              )}
            </div>
          ))}

          {groups.length === 0 && (
            <div className="text-center text-slate-400 text-sm py-10">
              This class has no groups yet.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
