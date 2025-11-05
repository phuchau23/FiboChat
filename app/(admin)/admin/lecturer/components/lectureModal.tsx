/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateLecturer, useUpdateLecturer } from "@/hooks/useLecturer";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/utils/error";

interface LecturerFormModalProps {
  open: boolean;
  selectedLecturer: {
    lecturerId: string;
    fullName: string;
    email: string;
    gender: string;
  } | null;
  onOpenChange: (open: boolean) => void;
}

export function LecturerFormModal({
  open,
  selectedLecturer,
  onOpenChange,
}: LecturerFormModalProps) {
  const { toast } = useToast();
  const createLecturer = useCreateLecturer();
  const updateLecturer = useUpdateLecturer();

  const [formData, setFormData] = useState({
    FullName: "",
    Email: "",
    Gender: "",
  });

  // Prefill khi edit
  useEffect(() => {
    if (selectedLecturer) {
      setFormData({
        FullName: selectedLecturer.fullName || "",
        Email: selectedLecturer.email || "",
        Gender: selectedLecturer.gender || "",
      });
    } else {
      setFormData({
        FullName: "",
        Email: "",
        Gender: "",
      });
    }
  }, [selectedLecturer, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    form.append("FullName", formData.FullName);

    try {
      if (selectedLecturer) {
        // Update
        form.append("Gender", formData.Gender);
        const res = await updateLecturer.mutateAsync({
          id: selectedLecturer.lecturerId,
          formData: form,
        });

        toast({
          title: "Success notification!",
          description: res.message || "Lecturer updated successfully.",
        });
      } else {
        //Create
        form.append("Email", formData.Email);
        const res = await createLecturer.mutateAsync(form);

        toast({
          title: "Success notification!",
          description: res.message || "Lecturer created successfully.",
        });
      }

      onOpenChange(false);
    } catch (error: any) {
      const message = getErrorMessage(
        error,
        "Failed to save lecturer. Please try again."
      );

      toast({
        title: "Oops! Something went wrong",
        description: message,
        variant: "destructive",
      });
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {selectedLecturer ? "Edit Lecturer" : "Add Lecturer"}
          </DialogTitle>
          <DialogDescription>
            {selectedLecturer
              ? "Form to update lecturer information"
              : "Form to add new lecturer profile"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={formData.FullName}
              onChange={(e) =>
                setFormData({ ...formData, FullName: e.target.value })
              }
              required
            />
          </div>

          {/* Email chỉ hiển thị khi Create */}
          {!selectedLecturer && (
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.Email}
                onChange={(e) =>
                  setFormData({ ...formData, Email: e.target.value })
                }
                required
              />
            </div>
          )}

          {/* Gender chỉ hiển thị khi Update */}
          {selectedLecturer && (
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.Gender}
                onValueChange={(value) =>
                  setFormData({ ...formData, Gender: value })
                }
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="hover:border-gray-500"
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
