"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUpdateDomain } from "@/hooks/useDomains";

// 🧩 Định nghĩa kiểu props
interface EditDomainDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  domain?: {
    id: string;
    name: string;
    description?: string;
  } | null;
  onUpdated?: () => void;
}

// 🧩 Truyền kiểu vào component
export default function EditDomainDialog({ open, onOpenChange, domain, onUpdated }: EditDomainDialogProps) {
  const [name, setName] = useState(domain?.name || "");
  const [description, setDescription] = useState(domain?.description || "");
  const updateDomain = useUpdateDomain();

  useEffect(() => {
    if (domain) {
      setName(domain.name);
      setDescription(domain.description || "");
    }
  }, [domain]);

  const handleSubmit = () => {
    if (!domain) return;
    updateDomain.mutate(
      { id: domain.id, name, description },
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
          <DialogTitle>Edit Domain</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
          <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
          <Button
            onClick={handleSubmit}
            disabled={updateDomain.isPending}
            className="w-full bg-orange-700 hover:bg-orange-600 text-white"
          >
            {updateDomain.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
