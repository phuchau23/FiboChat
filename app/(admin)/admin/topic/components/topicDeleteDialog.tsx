/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ConfirmDialog } from "@/app/(admin)/admin/components/comfirm-dialog";
import { useToast } from "@/hooks/use-toast";
import { useDeleteDomain } from "@/hooks/useDomain";
import { useDeleteMasterTopic } from "@/hooks/useMasterTopic";
import { useDeleteTopic } from "@/hooks/useTopic";
import { useState } from "react";

interface TopicDeleteDialogProps {
  open: boolean;
  activeTab: string;
  selectedItem: any;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
}

export function TopicDeleteDialog({
  open,
  activeTab,
  selectedItem,
  onOpenChange,
  onCancel,
}: TopicDeleteDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const deleteDomain = useDeleteDomain();
  const deleteMasterTopic = useDeleteMasterTopic();
  const deleteTopic = useDeleteTopic();

  const getTitle = () => {
    if (activeTab === "domains") return "Delete Domain";
    if (activeTab === "master-topics") return "Delete Master Topic";
    return "Delete Topic";
  };

  const handleConfirm = async () => {
    if (!selectedItem) return;
    setLoading(true);

    try {
      let message = "";

      if (activeTab === "domains") {
        await deleteDomain.mutateAsync(selectedItem.id);
        message = "Domain deleted successfully.";
      } else if (activeTab === "master-topics") {
        const res = await deleteMasterTopic.mutateAsync(selectedItem.id);
        message = res.message || "Master Topic deleted successfully.";
      } else if (activeTab === "topics") {
        const res = await deleteTopic.mutateAsync(selectedItem.id);
        message = res.message || "Topic deleted successfully.";
      }

      toast({ title: "Deleted Successfully", description: message });
      onOpenChange(false);
    } catch (err: any) {
      console.error("Delete failed:", err);
      toast({
        title: "Delete failed",
        description:
          err?.response?.data?.message ||
          err?.message ||
          "An error occurred while deleting. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmDialog
      open={open}
      title={getTitle()}
      description="Are you sure you want to delete this items?"
      onConfirm={handleConfirm}
      onCancel={onCancel}
      loading={loading}
      destructive
    />
  );
}
