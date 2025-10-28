/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
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
import { Textarea } from "../../../../components/ui/textarea";
import { cn } from "@/lib/utils";

export interface FormField {
  name: string;
  label: string;
  type:
    | "number"
    | "select"
    | "textarea"
    | "text"
    | "email"
    | "password"
    | "date"
    | "multiselect"; //
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

interface FormModalProps {
  open: boolean;
  title: string;
  fields: FormField[];
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  onOpenChange: (open: boolean) => void;
  loading?: boolean;
  error?: string;
}

function formatDateToDDMMYYYY(dateString?: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function parseDateFromDDMMYYYY(dateStr: string) {
  const [day, month, year] = dateStr.split("/");
  return `${year}-${month}-${day}`; // return dạng yyyy-mm-dd
}

export function FormModal({
  open,
  title,
  fields,
  initialData,
  onSubmit,
  onOpenChange,
  loading,
}: FormModalProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({});
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              {field.type === "textarea" ? (
                <Textarea
                  id={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  required={field.required}
                />
              ) : field.type === "select" ? (
                <Select
                  value={formData[field.name] || ""}
                  onValueChange={(value) => handleChange(field.name, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={field.placeholder} />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    className="bg-white shadow-md border-2 border-gray-200"
                  >
                    {field.options?.map((opt) => (
                      <SelectItem
                        key={opt.value}
                        value={opt.value}
                        className={cn(
                          "cursor-pointer rounded-md px-2 py-1.5 transition-colors",
                          "hover:not(:focus-visible):bg-gray-100 hover:not(:focus-visible):text-gray-900",
                          "focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none"
                        )}
                      >
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={field.name}
                  type={field.type}
                  value={
                    field.type === "date" && formData[field.name]
                      ? new Date(formData[field.name])
                          .toISOString()
                          .split("T")[0]
                      : formData[field.name] || ""
                  }
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  required={field.required}
                />
              )}
            </div>
          ))}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
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
