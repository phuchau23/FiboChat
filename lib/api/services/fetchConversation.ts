
// ========================
// 💬 Conversation Item

import apiService, { ApiResponse } from "../core";



export interface ChatbotResponseEvent {
  GroupId: string;
  ConversationId: string;
  Response: string;   // <-- dùng để hiển thị bubble AI
  Question: string;   // optional: để map với câu user nếu muốn
  Timestamp: string;  // ISO
}

// ========================
export interface ConversationItem {
  id: string;
  createById: string;
  classId: string;
  groupId: string;
  title: string;
  status: string;
  createdAt: string;
  updatedAt: string | null;
  messageCount: number;
  questionCount: number;
}

// ========================
// 📑 Paginated Response
// ========================
export interface ConversationListResponse {
  items: ConversationItem[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// ========================
// 🔹 Fetch Service
// ========================
export const fetchConversation = {
  // Lấy danh sách đoạn chat theo group
  getByGroup: async (
    groupId: string,
    page = 1,
    pageSize = 10
  ): Promise<ApiResponse<{ items: ConversationItem[] }>> => {
    const res = await apiService.get<ApiResponse<{ items: ConversationItem[] }>>(
      `/course/api/conversations/group/${groupId}?page=${page}&pageSize=${pageSize}`
    );
    return res.data;
  },

  // Lấy chi tiết 1 đoạn chat
  getById: async (
    conversationId: string
  ): Promise<ApiResponse<ConversationItem>> => {
    const res = await apiService.get<ApiResponse<ConversationItem>>(
      `/course/api/conversations/${conversationId}`
    );
    return res.data;
  },
};
