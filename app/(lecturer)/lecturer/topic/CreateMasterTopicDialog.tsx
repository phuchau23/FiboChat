"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Domain } from "@/hooks/services/fetchDomains";
import { useDomains } from "@/hooks/useDomains";
import { useCreateMasterTopic } from "@/hooks/useMasterTopics";
import { useSemesters } from "@/hooks/useSemester";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

export default function CreateMasterTopicDialog({ open, onOpenChange, onCreated }: Props) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [domainId, setDomainId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [loading, setLoading] = useState(false);

  const createMasterTopic = useCreateMasterTopic();
  const { data: domains } = useDomains();
  const { data: semesters } = useSemesters();

  // ✅ Reset form khi đóng/mở dialog
  useEffect(() => {
    if (!open) {
      setName("");
      setDesc("");
      setDomainId("");
      setSemesterId("");
      setLoading(false);
    }
  }, [open]);

  const handleCreate = async () => {
    if (!domainId || !name || !semesterId) {
      alert("Vui lòng điền đầy đủ thông tin trước khi tạo.");
      return;
    }

    setLoading(true);
    try {
      await createMasterTopic.mutateAsync({
        domainId,
        semesterId,
        lecturerIds: [], // ✅ Mặc định chưa assign giảng viên nào
        name,
        description: desc,
      });
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
          <DialogTitle>Create Master Topic</DialogTitle>
        </DialogHeader>

        {/* Domain */}
        <select
          value={domainId}
          onChange={(e) => setDomainId(e.target.value)}
          className="mb-2 w-full border rounded px-2 py-1"
        >
          <option value="">Select Domain</option>
          {domains?.data.items.map((d: Domain) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        {/* Semester */}
        <select
          value={semesterId}
          onChange={(e) => setSemesterId(e.target.value)}
          className="mb-2 w-full border rounded px-2 py-1"
        >
          <option value="">Select Semester</option>
          {semesters?.data.items.map((s) => (
            <option key={s.id} value={s.id}>
              {s.code} - {s.term} {s.year}
            </option>
          ))}
        </select>

        {/* ✅ Ẩn hoàn toàn phần chọn Lecturer, và ghi chú là “Chưa được gán” */}
        <div className="mb-3 border rounded p-2 bg-gray-50 dark:bg-slate-800">
          <p className="text-sm text-gray-600 dark:text-gray-300 italic">
            Lecturer: <span className="font-medium">Not assigned yet</span>
          </p>
        </div>

        {/* Name + Description */}
        <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="mb-2" />
        <Input placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} className="mb-2" />

        <Button
          onClick={handleCreate}
          className="mt-2 w-full bg-orange-600 hover:bg-orange-500 text-white"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Master Topic"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
