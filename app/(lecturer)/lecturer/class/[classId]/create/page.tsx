"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useCreateGroup } from "@/hooks/useGroup";
import { useToast } from "@/hooks/use-toast";
import { TableSkeleton } from "@/components/ui/table-skeleton";

export default function CreateGroupPage() {
  const { classId } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { mutate: createGroup, isPending } = useCreateGroup();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createGroup(
      { classId: classId as string, name, description },
      {
        onSuccess: () => {
          toast({
            title: "✅ Tạo nhóm thành công",
            description: `Nhóm "${name}" đã được tạo.`,
          });
          setTimeout(() => router.push(`/lecturer/class/${classId}`), 800);
        },
        onError: (err: unknown) => {
          // Check kiểu của err trước khi truy cập message
          let errorMessage = "Không thể tạo nhóm. Vui lòng thử lại.";
          if (err instanceof Error) {
            errorMessage = err.message;
          }
          toast({
            title: "❌ Lỗi tạo nhóm",
            description: errorMessage,
            variant: "destructive",
          });
        },
      }
    );
  };

  if (isPending) {
    return (
      <section className="bg-white rounded-3xl p-8 shadow-xl border border-orange-100 max-w-2xl mx-auto mt-10">
        <TableSkeleton rows={5} cols={2} />
      </section>
    );
  }

  return (
    <section className="bg-white rounded-3xl p-8 shadow-xl border border-orange-100 max-w-2xl mx-auto mt-10">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-orange-500 hover:text-orange-600 transition"
        >
          <ArrowLeft className="h-5 w-5" /> Back
        </button>
        <h2 className="text-2xl font-bold text-orange-600">Tạo nhóm mới</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên nhóm</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên nhóm..."
            className="border border-orange-200 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-orange-400 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Nhập mô tả nhóm..."
            rows={4}
            className="border border-orange-200 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-orange-400 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="bg-orange-500 text-white font-medium px-5 py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-70"
        >
          {isPending ? "Đang tạo..." : "Tạo nhóm"}
        </button>
      </form>
    </section>
  );
}
