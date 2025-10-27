"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUpdateTopic } from "@/hooks/useTopics";

// 🧩 Định nghĩa kiểu dữ liệu cho props
interface Topic {
  id: string;
  name: string;
  description?: string;
  status?: string;
  createdAt?: string;
}

interface EditTopicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topic?: Topic | null;
  onUpdated?: () => void;
}

export default function EditTopicDialog({ open, onOpenChange, topic, onUpdated }: EditTopicDialogProps) {
  const [name, setName] = useState(topic?.name || "");
  const [description, setDescription] = useState(topic?.description || "");
  const updateTopic = useUpdateTopic();

  useEffect(() => {
    if (topic) {
      setName(topic.name || "");
      setDescription(topic.description || "");
    }
  }, [topic]);

  const handleSubmit = () => {
    if (!topic) return;

    updateTopic.mutate(
      { id: topic.id, name, description },
      {
        onSuccess: () => {
          onUpdated?.();
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Topic</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
          <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />

          <Button
            onClick={handleSubmit}
            disabled={updateTopic.isPending}
            className="w-full bg-orange-600 hover:bg-orange-500 text-white"
          >
            {updateTopic.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
