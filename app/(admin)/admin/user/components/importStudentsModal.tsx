"use client";

import { useImportUsers } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useState, useRef } from "react";
import { UploadCloud, FileSpreadsheet, Trash2 } from "lucide-react";

interface ImportStudentsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportStudentsModal({
  open,
  onOpenChange,
}: ImportStudentsModalProps) {
  const importUsers = useImportUsers();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setFile = (file: File | null) => {
    setSelectedFile(file);
    if (!file && fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFilePicked = (files: FileList | null) => {
    if (!files?.[0]) return;
    setFile(files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) return toast.error("Please select an Excel file!");

    importUsers.mutate(selectedFile, {
      onSuccess: () => {
        toast.success("Import successful! Processing in background…");
        setFile(null);
        onOpenChange(false);
      },
      onError: (err) => toast.error(err?.message || "Import failed"),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="space-y-4 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Import Students
          </DialogTitle>
        </DialogHeader>

        {/* Drop Zone */}
        <div
          onDrop={(e) => {
            if (selectedFile) return;
            e.preventDefault();
            handleFilePicked(e.dataTransfer.files);
          }}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => {
            if (!selectedFile) fileInputRef.current?.click();
          }}
          className={`
    border-2 border-dashed rounded-lg p-6 text-center transition
    ${
      selectedFile
        ? "border-gray-200 bg-gray-50 opacity-60"
        : "border-gray-300 hover:border-primary cursor-pointer"
    }
  `}
        >
          <UploadCloud
            className={`mx-auto mb-3 ${
              selectedFile ? "text-gray-300" : "text-gray-400"
            }`}
            size={36}
          />
          <p className="font-medium">
            {selectedFile ? "Ready to upload" : "Drag & drop Excel file here"}
          </p>
          {!selectedFile && (
            <>
              <p className="text-sm text-gray-500 mb-3">or click to browse</p>
              <Button variant="outline" size="sm">
                Select File
              </Button>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx, .csv"
            className="hidden"
            onChange={(e) => handleFilePicked(e.target.files)}
            disabled={!!selectedFile}
          />
        </div>

        {/* File Preview */}
        {selectedFile && (
          <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="text-primary" />
              <span className="text-sm font-medium">{selectedFile.name}</span>
            </div>
            <button
              className="text-red-500 hover:text-red-600"
              onClick={() => setFile(null)}
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={importUsers.isPending || !selectedFile}
          className="w-full"
        >
          {importUsers.isPending ? "Uploading..." : "Import Students"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
