// /lib/hub/types.ts
export const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";

export interface AskChatbotRequest {
  prompt: string;
  conversationId: string; // Guid string; dùng EMPTY_GUID nếu chưa có
  userId: string;
}

export interface ChatbotResponseEvent {
  conversationId: string;
  questionId: string;
  answerId: string;
  question: string;
  answer: string;
  responseAt: string;        // ISO
  usedQAPair: boolean;
  processingTimeMs: number;
}