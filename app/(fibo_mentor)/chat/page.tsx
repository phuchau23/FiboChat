"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatHeader from "./components/ChatHeader";
import ChatInput from "./components/ChatInput";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import ChatMessages from "./components/ChatMessage";

interface Message {
  id: number;
  content: string;
  role: "user" | "assistant";
  createdAt: string;
}

interface Conversation {
  id: number;
  title: string;
  messages: Message[];
  createdAt: string;
}

const mockConversations: Conversation[] = [
  {
    id: 1,
    title: "SWP là môn học như thế nào",
    messages: [
      {
        id: 1,
        content: "SWP là môn học như thế nào",
        role: "user",
        createdAt: "2025-01-14T10:00:00Z",
      },

      {
        id: 2,
        content:
          "SWP (Software Project) là môn học về quản lý dự án phần mềm...",
        role: "assistant",
        createdAt: "2025-01-14T10:00:05Z",
      },
    ],
    createdAt: "2025-01-14T10:00:00Z",
  },
];

const mockTeams = [
  { id: 1, name: "Team" },
  { id: 2, name: "Personal" },
];

const mockTopics = [
  { id: 1, name: "Topic" },
  { id: 2, name: "SWP" },
];

export default function FiboMentor() {
  const [conversations, setConversations] =
    useState<Conversation[]>(mockConversations);
  const [selectedConversationId, setSelectedConversationId] = useState<
    number | null
  >(null);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [selectedTeam, setSelectedTeam] = useState(mockTeams[0]);
  const [selectedTopic, setSelectedTopic] = useState(mockTopics[0]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectConversation = (conversationId: number) => {
    const conversation = conversations.find((c) => c.id === conversationId);
    if (conversation) {
      setSelectedConversationId(conversationId);
      setCurrentMessages(conversation.messages);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    const userMessage: Message = {
      id: Date.now(),
      content: message.trim(),
      role: "user",
      createdAt: new Date().toISOString(),
    };

    if (selectedConversationId === null) {
      const newConversation: Conversation = {
        id: Date.now(),
        title: message.trim().slice(0, 50),
        messages: [userMessage],
        createdAt: new Date().toISOString(),
      };
      setConversations([newConversation, ...conversations]);
      setSelectedConversationId(newConversation.id);
      setCurrentMessages([userMessage]);
    } else {
      setCurrentMessages([...currentMessages, userMessage]);
    }

    setMessage("");
    setIsLoading(true);

    setTimeout(() => {
      const assistantMessage: Message = {
        id: Date.now() + 1,
        content: "Đây là câu trả lời mẫu từ AI.",
        role: "assistant",
        createdAt: new Date().toISOString(),
      };
      setCurrentMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleNewChat = () => {
    setSelectedConversationId(null);
    setCurrentMessages([]);
    setMessage("");
  };

  const showEmptyState =
    selectedConversationId === null && currentMessages.length === 0;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        conversations={conversations}
        selectedConversationId={selectedConversationId}
        onSelect={handleSelectConversation}
        onNewChat={handleNewChat}
      />

      <div className="flex-1 flex flex-col">
        <ChatHeader
          selectedTeam={selectedTeam}
          setSelectedTeam={setSelectedTeam}
          mockTeams={mockTeams}
          selectedTopic={selectedTopic}
          setSelectedTopic={setSelectedTopic}
          mockTopics={mockTopics}
        />

        <main className="flex-1 flex flex-col overflow-hidden">
          {showEmptyState ? (
            <div className="flex-1 flex flex-col items-center justify-center pb-6 ">
              <div className="w-full max-w-2xl space-y-8">
                <h2 className="text-3xl font-semibold text-center">
                  Hôm nay bạn có ý tưởng gì ?
                </h2>
                <ChatInput
                  message={message}
                  setMessage={setMessage}
                  onSend={handleSendMessage}
                  isLoading={isLoading}
                />
              </div>
            </div>
          ) : (
            <>
              <ChatMessages messages={currentMessages} isLoading={isLoading} />
              <div className="p-4">
                <div className="w-full flex justify-center">
                  <div className="w-full max-w-2xl">
                    <ChatInput
                      message={message}
                      setMessage={setMessage}
                      onSend={handleSendMessage}
                      isLoading={isLoading}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
