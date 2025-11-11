"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useFeedback } from "@/hooks/useFeedback";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import {
  ThumbsUp,
  Minus,
  ThumbsDown,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export type HelpfulType = "Helpful" | "Unhelpful" | "Neutral";

export interface FeedbackDialogProps {
  answerId: string;
  answerContent: string;
  defaultHelpful?: HelpfulType;
  trigger?: ReactNode;
  maxCommentLen?: number;
}

export default function FeedbackDialog({
  answerId,
  answerContent,
  defaultHelpful = "Helpful",
  trigger,
  maxCommentLen = 300,
}: FeedbackDialogProps) {
  const { toast } = useToast();
  const { createFeedback, isLoading } = useFeedback();

  const [open, setOpen] = useState(false);
  const [helpful, setHelpful] = useState<HelpfulType>(defaultHelpful);
  const [comment, setComment] = useState("");

  const canSubmit = useMemo(
    () => Boolean(answerId && helpful),
    [answerId, helpful]
  );

  const answerPreview = useMemo(() => {
    const text = answerContent.replace(/<[^>]+>/g, "");
    return text.trim();
  }, [answerContent]);

  const over = comment.length > maxCommentLen;

  const onSubmit = async () => {
    if (!canSubmit || over) return;

    try {
      await createFeedback({
        AnswerId: answerId,
        Helpful: helpful,
        Comment: comment.trim() ? comment.trim() : undefined,
      });

      // ✅ Toast thành công
      toast({
        title: (
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Đã gửi đánh giá
          </span>
        ) as unknown as string,
        description: "Cảm ơn bạn đã đánh giá để giúp AI tốt hơn!",
      });

      setOpen(false);
      setComment("");
      setHelpful(defaultHelpful);
    } catch (e: unknown) {
      // ❌ Toast thất bại
      toast({
        variant: "destructive",
        title: (
          <span className="inline-flex items-center gap-2">
            <XCircle className="h-4 w-4" /> Gửi đánh giá thất bại
          </span>
        ) as unknown as string,
        description: e instanceof Error ? e.message : "Vui lòng thử lại sau.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Đánh giá
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Gửi đánh giá câu trả lời</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Câu trả lời (preview) */}
          <div className="grid gap-2">
            <Label className="text-sm text-muted-foreground">Câu trả lời</Label>
            <div className="rounded-xl border bg-muted/30 p-3 max-h-40 overflow-auto text-[14.5px] leading-relaxed whitespace-pre-wrap">
              {answerPreview || "(Không có nội dung)"}
            </div>
          </div>

          {/* Đánh giá (pills đẹp + hover ring) */}
          <div className="grid gap-2">
            <Label>Đánh giá</Label>
            <RadioGroup
              value={helpful}
              onValueChange={(v) => setHelpful(v as HelpfulType)}
              className="grid grid-cols-3 gap-2"
            >
              <Pill
                id="r-helpful"
                value="Helpful"
                current={helpful}
                icon={<ThumbsUp className="h-4 w-4" />}
                label="Helpful"
              />
              <Pill
                id="r-neutral"
                value="Neutral"
                current={helpful}
                icon={<Minus className="h-4 w-4" />}
                label="Neutral"
              />
              <Pill
                id="r-unhelpful"
                value="Unhelpful"
                current={helpful}
                icon={<ThumbsDown className="h-4 w-4" />}
                label="Unhelpful"
              />
            </RadioGroup>
          </div>

          {/* Nhận xét */}
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="fb-comment">Nhận xét</Label>
              <span
                className={cn(
                  "text-[11px] text-muted-foreground",
                  over && "text-red-600"
                )}
              >
                {comment.length}/{maxCommentLen}
              </span>
            </div>
            <Textarea
              id="fb-comment"
              placeholder="Ví dụ: Câu trả lời thiếu thông tin về thời gian làm Quiz..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="resize-y rounded-xl"
            />
            <p className="text-xs text-muted-foreground">
              Mẹo: Cứ nói cụ thể bạn cần gì hoặc phần nào chưa ổn — bọn mình sẽ
              cải thiện ngay!
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Huỷ
          </Button>
          <Button onClick={onSubmit} disabled={!canSubmit || isLoading || over}>
            {isLoading ? "Đang gửi..." : "Gửi đánh giá"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Pill({
  id,
  value,
  current,
  icon,
  label,
}: {
  id: string;
  value: HelpfulType;
  current: HelpfulType;
  icon: React.ReactNode;
  label: string;
}) {
  const checked = current === value;
  return (
    <label
      htmlFor={id}
      className={cn(
        "cursor-pointer select-none rounded-xl border px-3 py-2 text-sm flex items-center justify-center gap-1.5",
        "transition-all ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        checked
          ? "bg-primary text-primary-foreground border-primary shadow-sm"
          : "bg-background hover:bg-muted"
      )}
    >
      <RadioGroupItem value={value} id={id} className="sr-only" />
      {icon}
      <span>{label}</span>
    </label>
  );
}
