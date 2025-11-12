"use client";

import { useImportUsers } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef } from "react";
import { UploadCloud, FileSpreadsheet, Trash2, Loader2 } from "lucide-react";

interface ImportStudentsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJobStarted?: (jobId: string) => void;
}

export function ImportStudentsModal({
  open,
  onOpenChange,
  onJobStarted,
}: ImportStudentsModalProps) {
  const importUsers = useImportUsers();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ Xử lý chọn / bỏ file
  const setFile = (file: File | null) => {
    setSelectedFile(file);
    if (!file && fileInputRef.current) fileInputRef.current.value = "";
  };

  // ✅ Upload
  const handleUpload = () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please choose an Excel file before uploading.",
        variant: "destructive",
      });
      return;
    }

    importUsers.mutate(selectedFile, {
      onSuccess: (res) => {
        // Gửi Job ID ra ngoài để tracker theo dõi
        if (onJobStarted) onJobStarted(res.importJobId);

        // Đóng modal & reset file
        setFile(null);
        onOpenChange(false);

        // Thông báo bắt đầu xử lý nền
        toast({
          title: "Import started",
          description: "Your file is being processed in the background.",
        });
      },
      onError: (err) => {
        toast({
          title: "Upload failed",
          description: err?.message || "An error occurred while uploading.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Import Students
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Drop zone */}
          <div
            onDrop={(e) => {
              e.preventDefault();
              if (!selectedFile) setFile(e.dataTransfer.files?.[0] || null);
            }}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => {
              if (!selectedFile) fileInputRef.current?.click();
            }}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
              selectedFile
                ? "border-gray-200 bg-gray-50 opacity-60"
                : "border-gray-300 hover:border-primary cursor-pointer"
            }`}
          >
            <UploadCloud
              className={`mx-auto mb-3 ${
                selectedFile ? "text-gray-300" : "text-gray-400"
              }`}
              size={48}
            />
            <p className="font-medium text-lg mb-2">
              {selectedFile ? "Ready to upload" : "Drag & drop Excel file"}
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
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              disabled={!!selectedFile}
            />
          </div>

          {/* File preview */}
          {selectedFile && (
            <div className="flex items-center justify-between bg-primary/10 p-4 rounded-lg border border-primary/20">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="text-primary" size={24} />
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                className="text-red-500 hover:text-red-600 p-2"
                onClick={() => setFile(null)}
              >
                <Trash2 size={20} />
              </button>
            </div>
          )}

          {/* Upload button */}
          <Button
            onClick={handleUpload}
            disabled={importUsers.isPending || !selectedFile}
            className="w-full"
          >
            {importUsers.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Starting Import...
              </>
            ) : (
              "Import Students"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
