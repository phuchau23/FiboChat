import { ConversationItem } from "@/lib/api/services/fetchConversation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDownIcon,
  SquarePen,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";

interface SidebarProps {
  conversations: ConversationItem[];
  selectedConversationId: string;
  onSelect: (id: string) => void;
  onNewChat: () => void;
}

export default function Sidebar({
  conversations,
  selectedConversationId,
  onSelect,
  onNewChat,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [chatListOpen, setChatListOpen] = useState(true); // trạng thái mở/đóng list
  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-64"
      } border-r border-border bg-background p-4 flex flex-col transition-all duration-300`}
    >
      {/* ===== Header: Logo + Toggle button ===== */}
      <div className="flex items-center justify-between mb-6">
        {/* Logo */}
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Image
              width={20}
              height={20}
              src="/logo_header.png" // Đặt đúng đường dẫn logo của bạn tại public/logo.svg
              alt="Logo"
              className="w-7 h-7"
            />
          </div>
        )}

        {/* Nút toggle thu gọn / mở rộng */}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={() => setCollapsed((prev) => !prev)}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* ===== Nút tạo chat mới ===== */}
      {collapsed ? (
        <Button
          variant="ghost"
          size="icon"
          className="mb-3 mx-auto h-9 w-9"
          onClick={onNewChat}
          aria-label="Đoạn chat mới"
        >
          <SquarePen className="h-6 w-6 text-orange-500" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          className="w-full justify-start text-orange-500 hover:text-orange-500 hover:bg-orange-50 mb-3 px-2"
          onClick={onNewChat}
        >
          <SquarePen className="mr-2 h-6 w-6 shrink-0" />
          <span className="truncate">Đoạn chat mới</span>
        </Button>
      )}

      {/* ===== Tiêu đề có mũi tên: Đoạn chat ▾ ===== */}
      {!collapsed && (
        <button
          type="button"
          onClick={() => setChatListOpen((v) => !v)}
          className="flex items-center gap-1 text-sm text-muted-foreground px-1 py-1 mb-2 hover:text-foreground"
        >
          <span className="select-none opacity-50">Đoạn chat</span>
          <ChevronDownIcon
            className={`h-4 w-4 transition-transform ${
              chatListOpen ? "rotate-0" : "-rotate-90"
            }`}
          />
        </button>
      )}

      {/* ===== Danh sách hội thoại (ẩn/hiện theo chatListOpen) ===== */}
      {chatListOpen && (
        <nav
          className={`flex-1 overflow-y-auto ${
            collapsed ? "space-y-3" : "space-y-2"
          }`}
        >
          {conversations.map((conversation) =>
            collapsed ? (
              // THU GỌN: nút icon vuông, không méo
              <button
                key={conversation.id}
                onClick={() => onSelect(conversation.id)}
                className="flex items-center justify-center h-9 w-9 mx-auto rounded-md hover:bg-muted"
                title={conversation.title}
              >
                <MessageCircle className="h-4 w-4" />
              </button>
            ) : (
              // MỞ RỘNG: nút full-width như cũ
              <button
                key={conversation.id}
                onClick={() => onSelect(conversation.id)}
                className={`w-full flex items-center text-left px-2 py-2 text-sm rounded-md hover:bg-muted transition-colors ${
                  selectedConversationId === conversation.id ? "bg-muted" : ""
                }`}
                title=""
              >
                <span className="truncate">{conversation.title}</span>
              </button>
            )
          )}
        </nav>
      )}
    </aside>
  );
}
