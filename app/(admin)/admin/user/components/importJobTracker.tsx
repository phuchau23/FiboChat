"use client";

import { useImportJob, useImportItems } from "@/hooks/useUser";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useRef, useState } from "react";

export function ImportJobTracker({ jobId }: { jobId: string }) {
  const { data: jobStatus } = useImportJob(jobId);
  const { data: importItems } = useImportItems(jobId);
  const { toast, dismiss } = useToast();

  const toastRef = useRef<string | null>(null);
  const [hasShownResult, setHasShownResult] = useState(false);

  useEffect(() => {
    // Nếu chưa có jobStatus, importItems, hoặc đã hiển thị kết quả thì bỏ qua
    if (!jobStatus || !importItems || hasShownResult) return;

    const { status, totalCount, successCount } = jobStatus;
    const success = importItems.filter((i) => i.status === "Success").length;
    const skippedItems = importItems.filter((i) => i.status === "Skipped");

    // Đang chạy
    if (["Running", "Processing"].includes(status)) {
      const msg = `${skippedItems.length} skipped`;

      // Chỉ tạo toast 1 lần duy nhất
      if (!toastRef.current) {
        const t = toast({
          title: "Importing students...",
          description: msg,
          duration: Infinity,
        });
        toastRef.current = t.id;
      }
      return; // Không cho phép đi xuống phần Completed
    }

    // Completed
    if (status === "Completed") {
      // Nếu đã đánh dấu rồi thì không làm lại nữa
      if (hasShownResult) return;

      // Đánh dấu đã hiển thị kết quả để chặn re-render
      setHasShownResult(true);

      // Đóng toast chạy nền
      if (toastRef.current) {
        dismiss(toastRef.current);
        toastRef.current = null;
      }

      const skipped = skippedItems.length;
      if (skipped > 0) {
        toast({
          title: "Import completed with issues",
          description: (
            <div className="mt-2 space-y-3 text-sm">
              <p className="font-medium text-muted-foreground">
                {successCount || success}/{totalCount} succeeded · {skipped}{" "}
                skipped
              </p>
              <div className="rounded-md border border-muted bg-muted/30 p-2">
                <table className="w-full text-xs text-muted-foreground">
                  <thead>
                    <tr className="border-b border-muted/50 text-muted-foreground uppercase text-[10px]">
                      <th className="text-left pb-1">Email / Student ID</th>
                      <th className="text-left pb-1">Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skippedItems.slice(0, 5).map((item, i) => (
                      <tr
                        key={i}
                        className="border-b border-muted/30 last:border-0"
                      >
                        <td className="py-1 font-medium text-foreground">
                          {item.email || item.studentId}
                        </td>
                        <td className="py-1 text-red-500">
                          {item.message || "Skipped"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {skipped > 5 && (
                  <p className="text-[11px] text-muted-foreground mt-1 italic">
                    ...and {skipped - 5} more skipped
                  </p>
                )}
              </div>
            </div>
          ),
          duration: 10000,
        });
      } else {
        toast({
          title: "Import completed",
          description: (
            <p className="text-sm text-muted-foreground mt-1">
              {successCount || success}/{totalCount} students imported
              successfully.
            </p>
          ),
          duration: 5000,
        });
      }
    }
  }, [jobStatus?.status, importItems?.length, hasShownResult, toast, dismiss]);

  return null;
}
