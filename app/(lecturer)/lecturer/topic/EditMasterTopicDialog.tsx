"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUpdateMasterTopic } from "@/hooks/useMasterTopics";
import { useDomains } from "@/hooks/useDomains";
import { useSemesters } from "@/hooks/useSemester";
import { Domain } from "@/hooks/services/fetchDomains";
import { MasterTopic } from "@/hooks/services/fetchMasterTopics";

interface EditMasterTopicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  masterTopic?: MasterTopic | null;
  onUpdated?: () => void;
}

export default function EditMasterTopicDialog({
  open,
  onOpenChange,
  masterTopic,
  onUpdated,
}: EditMasterTopicDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [domainId, setDomainId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [lecturerIds, setLecturerIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const { data: domains } = useDomains();
  const { data: semesters } = useSemesters();

  const updateMasterTopic = useUpdateMasterTopic();

  // ✅ Lấy thông tin lecturer hiện tại từ localStorage
  const getCurrentLecturer = () => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) return null;
      const user = JSON.parse(userData);
      return {
        id: user.lecturerId || user.id || "",
        name: user.fullName || user.name || "Current Lecturer",
      };
    } catch {
      return null;
    }
  };

  const currentLecturer = getCurrentLecturer();

  // ✅ Gán dữ liệu khi mở dialog hoặc khi masterTopic thay đổi
  useEffect(() => {
    if (masterTopic) {
      setName(masterTopic.name || "");
      setDescription(masterTopic.description || "");
      setDomainId(masterTopic.domain?.id || "");
      setSemesterId(masterTopic.semester?.id || "");

      // ✅ Luôn đảm bảo lecturer là người đang đăng nhập
      if (currentLecturer?.id) {
        setLecturerIds([currentLecturer.id]);
      }
    }
  }, [masterTopic, open]);

  const handleSubmit = async () => {
    if (!masterTopic) return;
    if (!domainId || !semesterId) {
      alert("Vui lòng điền đầy đủ thông tin trước khi lưu.");
      return;
    }

    setLoading(true);
    try {
      await updateMasterTopic.mutateAsync({
        id: masterTopic.id,
        domainId,
        semesterId,
        lecturerIds,
        name,
        description,
      });
      onUpdated?.();
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Master Topic</DialogTitle>
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

        {/* ✅ Lecturer hiển thị cố định (không cho chỉnh sửa) */}
        {currentLecturer && (
          <div className="mb-2 border rounded p-2 bg-gray-50 dark:bg-slate-800">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Lecturer: <span className="font-semibold">{currentLecturer.name}</span>
            </p>
          </div>
        )}

        {/* Name + Description */}
        <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="mb-2" />
        <Input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mb-2"
        />

        <Button
          onClick={handleSubmit}
          className="mt-2 w-full bg-orange-600 hover:bg-orange-500 text-white"
          disabled={loading || updateMasterTopic.isPending}
        >
          {loading || updateMasterTopic.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
