import { useQAPairs } from "@/hooks/useQAPairs";
import QAPairCard from "./QAPairCard";
import { useState } from "react";

interface QAPairSidebarProps {
  topicId?: string;
  onUsePrompt: (question: string) => void;
}

export default function QAPairSidebar({
  topicId,
  onUsePrompt,
}: QAPairSidebarProps) {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, error } = useQAPairs({
    topicId,
    status: "Active",
    page,
    pageSize,
  });

  if (isLoading) {
    return (
      <div className="w-3/12 bg-white border-l border-gray-200 p-5">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 rounded-lg p-5 h-40" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-3/12 bg-white border border-gray-200 p-5">
        <p className="text-red-500 text-sm">Failed to load QA pairs</p>
      </div>
    );
  }

  const qaPairs = data?.qaPairs || [];
  const pagination = data?.pagination;

  return (
    <div className="w-2/12 h-full">
      {/* QA Pair List */}

      <div className="flex-1 overflow-y-auto  space-y-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {qaPairs.length === 0 ? (
          <p className="text-gray-500 text-sm text-center mt-8">
            No prompts available
          </p>
        ) : (
          qaPairs.map((qaPair) => (
            <QAPairCard
              key={qaPair.id}
              qaPair={qaPair}
              onUsePrompt={onUsePrompt}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="p-5 border-t border-gray-200 bg-white">
          <div className="flex items-center justify-between text-[13px]">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={!pagination.hasPreviousPage}
              className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-gray-600">
              {pagination.currentPage} / {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
              disabled={!pagination.hasNextPage}
              className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
