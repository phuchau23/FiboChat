// 📁 src/components/ui/table-skeleton.tsx
"use client";
import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton({
  rows = 5,
  cols = 6,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <div className="space-y-3 animate-pulse">
      {/* header giả */}
      <div className="grid grid-cols-6 gap-3">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-full rounded" />
        ))}
      </div>

      {/* các dòng dữ liệu giả */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-6 gap-3">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-10 w-full rounded" />
          ))}
        </div>
      ))}
    </div>
  );
}
