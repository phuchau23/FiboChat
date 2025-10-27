"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MasterTopic } from "@/hooks/services/fetchMasterTopics";
import { useCreateTopic } from "@/hooks/useTopics";
import { useMasterTopics } from "@/hooks/useMasterTopics";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

export default function CreateTopicDialog({ open, onOpenChange, onCreated }: Props) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [masterId, setMasterId] = useState("");
  const [loading, setLoading] = useState(false); // quản lý loading thủ công

  const createTopic = useCreateTopic();
  const { data: masterTopics } = useMasterTopics();

  useEffect(() => {
    if (!open) {
      setName("");
      setDesc("");
      setMasterId("");
      setLoading(false);
    }
  }, [open]);

  const handleCreate = async () => {
    if (!masterId || !name) return;
    setLoading(true);
    try {
      await createTopic.mutateAsync({ masterTopicId: masterId, name, description: desc });
      onCreated?.();
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Topic</DialogTitle>
        </DialogHeader>

        <select
          value={masterId}
          onChange={(e) => setMasterId(e.target.value)}
          className="mb-2 w-full border rounded px-2 py-1"
        >
          <option value="">Select Master Topic</option>
          {masterTopics?.data.items.map((mt: MasterTopic) => (
            <option key={mt.id} value={mt.id}>
              {mt.name}
            </option>
          ))}
        </select>

        <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="mb-2" />
        <Input placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} className="mb-2" />

        <Button onClick={handleCreate} className="mt-2 w-full" disabled={loading}>
          {loading ? "Creating..." : "Create Topic"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
