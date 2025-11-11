"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface UnselectedTopicModalProps {
  open: boolean;
  onClose: () => void;
  topics: { id: string; name: string; masterTopicName: string | null }[];
}

export function UnselectedTopicModal({
  open,
  onClose,
  topics,
}: UnselectedTopicModalProps) {
  const [search, setSearch] = useState("");

  const filtered = topics.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Topics Not Chosen</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Search topic..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4"
        />

        <div className="max-h-[350px] overflow-y-auto space-y-3">
          {filtered.map((t) => (
            <div key={t.id} className="border-b pb-2 space-y-1">
              <div className="font-medium text-slate-900">{t.name}</div>
              {t.masterTopicName && (
                <div className="text-xs text-slate-500">
                  Master topic: {t.masterTopicName}
                </div>
              )}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center text-slate-500 text-sm py-4">
              No topics match your search.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
