import { UiMessage } from "@/hooks/useChatbotHub";

// ==== ADD: types cho API history (đúng theo payload bạn đưa) ====
export type HistoryAnswer = {
  answerId: string;
  answerContent: string;
  isAI: boolean;
  answerCreatedAt: string;
};

export type HistoryItem = {
  questionId: string;
  userId: string;
  questionText: string;
  questionCreatedAt: string;
  answers: HistoryAnswer[];
};

export type HistoryResponse = {
  statusCode: number;
  code: string;
  message: string;
  data: {
    conversationId: string;
    conversationTitle: string;
    groupId: string;
    totalQuestions: number;
    totalAnswers: number;
    conversationCreatedAt: string;
    lastActivityAt: string;
    history: HistoryItem[];
  };
};

// ==== ADD: map history → UiMessage[] (user trước, rồi tới các answer) ====
// ==== FIX: map history → UiMessage[] có đủ 'ts' ====
// Map lịch sử: question → user, answer → assistant
export function mapHistoryToUiMessages(items: HistoryItem[], convId?: string): UiMessage[] {
  const out: UiMessage[] = [];
  for (const it of items) {
    // User question
    out.push({
      role: "user",
      content: it.questionText ?? "",
      conversationId: convId,
      ts: it.questionCreatedAt, // ISO từ API
    });

    // Answers của AI (có thể nhiều)
    for (const ans of it.answers ?? []) {
      out.push({
        role: "assistant",
        content: ans.answerContent ?? "",
        conversationId: convId,
        ts: ans.answerCreatedAt, // ISO từ API
      });
    }
  }
  return out;
}
