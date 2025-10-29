import { Button } from "@/components/ui/button";
import { Conversation } from "@/lib/data/api";
import { Plus } from "lucide-react";

interface SidebarProps {
  conversations: Conversation[];
  selectedConversationId: number | null;
  onSelect: (id: number) => void;
  onNewChat: () => void;
}

export default function Sidebar({
  conversations,
  selectedConversationId,
  onSelect,
  onNewChat,
}: SidebarProps) {
  return (
    <aside className="w-64 border-r border-border bg-background p-4 flex flex-col">
      <Button
        variant="ghost"
        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 mb-6"
        onClick={onNewChat}
      >
        <Plus className="mr-2 h-4 w-4" />
        Đoạn chat mới
      </Button>

      <nav className="flex-1 space-y-2 overflow-y-auto">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => onSelect(conversation.id)}
            className={`w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors ${
              selectedConversationId === conversation.id ? "bg-muted" : ""
            }`}
          >
            {conversation.title}
          </button>
        ))}
      </nav>
    </aside>
  );
}
