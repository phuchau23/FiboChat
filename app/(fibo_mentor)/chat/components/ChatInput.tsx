import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

interface ChatInputProps {
  message: string;
  setMessage: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
}

export default function ChatInput({
  message,
  setMessage,
  onSend,
  isLoading,
}: ChatInputProps) {
  return (
    <div className="relative">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
        placeholder="Hỏi bất kì điều gì về module..."
        className="
          pr-12 py-6 rounded-full 
          shadow-md 
          border border-border/50 
          bg-background 
          focus-visible:ring-0 
          focus-visible:border-border/50 
          outline-none 
          transition-all duration-200
        "
        disabled={isLoading}
      />
      <Button
        size="icon"
        onClick={onSend}
        className="
          absolute right-2 top-1/2 -translate-y-1/2 
          rounded-full h-8 w-8 
          bg-primary text-primary-foreground
          hover:bg-primary/90 transition-all duration-200
        "
        disabled={!message.trim() || isLoading}
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
    </div>
  );
}
