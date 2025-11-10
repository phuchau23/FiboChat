"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as signalR from "@microsoft/signalr";
import { useClassEnrollmentByUser } from "@/hooks/useGroupEnrollment";
import { getCookie } from "cookies-next";

/** FE message model */
export type UiMsgRole = "user" | "assistant";
export interface UiMessage {
  id?: string;                 // nếu BE có id thì set, để key/dedupe tốt hơn
  role: UiMsgRole;
  content: string;
  conversationId?: string;
  ts: string;                  // ISO
}

/** BE payload variants */
export interface ChatResponsePascal {
  GroupId?: string;
  ConversationId?: string;
  Question?: string;
  Response?: string;
  Timestamp?: string;
  questionId?: string;
  answerId?: string;
  usedQAPair?: boolean;
  topicId?: string; 
}
export interface ChatResponseCamel {
  groupId?: string;
  conversationId?: string;
  question?: string;
  answer?: string;
  response?: string;
  responseAt?: string;
  timestamp?: string;
  processingTimeMs?: number;
}
export type ChatResponse = ChatResponsePascal | ChatResponseCamel;

const GUID_EMPTY = "00000000-0000-0000-0000-000000000000";

/* ---------------- mini helpers (no any) ---------------- */
function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
function pickStr(obj: unknown, keys: readonly string[]): string | undefined {
  if (!isObject(obj)) return;
  for (const k of keys) {
    const val = obj[k];
    if (typeof val === "string" && val.trim()) return val;
  }
}
function normalize(evt: unknown) {
  const id =
    pickStr(evt, ["answerId", "AnswerId", "responseId", "ResponseId"]) ?? undefined;
  const content = pickStr(evt, ["answer", "Response", "response"]);
  const cid = pickStr(evt, ["ConversationId", "conversationId"]);
  const gid = pickStr(evt, ["GroupId", "groupId"]);
  const ts =
    pickStr(evt, ["Timestamp", "timestamp", "responseAt"]) ??
    new Date().toISOString();
  return { id, content, cid, gid, ts };
}
function eventKey(evt: unknown) {
  const ansId =
    pickStr(evt, ["answerId", "AnswerId", "responseId", "ResponseId"]) ?? "";
  if (ansId) return `id:${ansId}`;
  const cid = pickStr(evt, ["ConversationId", "conversationId"]) ?? "";
  const ts = pickStr(evt, ["Timestamp", "timestamp", "responseAt"]) ?? "";
  const content = pickStr(evt, ["answer", "Response", "response"]) ?? "";
  return `h:${cid}|${ts}|${content.slice(0, 80)}`;
}

/* ---------------- Hook ---------------- */
export function useChatbotHub(userId?: string) {
  const { data: enrollment } = useClassEnrollmentByUser(userId);
  const groupId = enrollment?.group?.id;

  const connRef = useRef<signalR.HubConnection | null>(null);
  const startedRef = useRef(false);
  const seenRef = useRef<Set<string>>(new Set()); // chống trùng

  const [isConnected, setIsConnected] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [messages, setMessages] = useState<UiMessage[]>([]);

  // Mount & connect (1 lần / userId)
  useEffect(() => {
    if (!userId) return;
    if (connRef.current) return; // chặn StrictMode double-mount

    const conn = new signalR.HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_API_BASE_URL}/course/hubs/chatbot`, {
        withCredentials: true,
        accessTokenFactory: () => {
          const raw = getCookie("auth-token");
          if (!raw) return "";
          const token = typeof raw === "string" ? raw : raw.toString();
          return token.replace(/^Bearer\s+/i, "");
        },
      })
      .withAutomaticReconnect()
      .build();

    connRef.current = conn;

    const handler = (evt: unknown) => {
      const key = eventKey(evt);
      if (seenRef.current.has(key)) return;
      seenRef.current.add(key);

      const { id, content, cid, ts } = normalize(evt);
      if (!content) {
        console.warn("ReceiveChatbotResponse: missing content", evt);
        return;
      }
      if (cid) setConversationId(cid);

      setMessages((prev) => [
        ...prev,
        {
          id,
          role: "assistant",
          content,
          conversationId: cid,
          ts: ts ?? new Date().toISOString(),
        },
      ]);

      console.log("🤖 AI trả lời:", evt);
    };

    // xoá mọi handler trước (hot-reload dev)
    conn.off("ReceiveChatbotResponse");
    conn.on("ReceiveChatbotResponse", handler);

    (async () => {
      try {
        await conn.start();
        startedRef.current = true;
        setIsConnected(true);
        console.log("✅ SignalR connected");
      } catch (err) {
        console.error("❌ Hub start failed:", err);
      }
    })();

    return () => {
      const c = connRef.current;
      if (c) {
        c.off("ReceiveChatbotResponse", handler);
        if (startedRef.current) void c.stop();
      }
      connRef.current = null;
      startedRef.current = false;
      // theo nhu cầu có thể giữ seenRef để tránh duplicate khi reconnect ngắn
    };
  }, [userId]);

  // Join group khi có groupId
  useEffect(() => {
    const c = connRef.current;
    if (!c || !isConnected || !groupId) return;
    c.invoke("JoinChatGroup", groupId)
      .then(() => console.log("👥 Joined group:", groupId))
      .catch((e) => console.error("❌ Join group error:", e));
  }, [isConnected, groupId]);

  // Gửi câu hỏi
  const askChatbot = useCallback(
    async (prompt: string, selectedConversationId?: string | null) => {
      const c = connRef.current;
      if (!c || !isConnected) {
        console.warn("⚠️ Hub chưa sẵn sàng!");
        return;
      }
      const cid =
        selectedConversationId && selectedConversationId.trim()
          ? selectedConversationId
          : GUID_EMPTY;

      console.log("📤 AskChatbot:", { prompt, cid, userId });
      try {
        await c.invoke("AskChatbot", prompt, cid, userId);
      } catch (err) {
        console.error("❌ AskChatbot error:", err);
      }
    },
    [isConnected, userId]
  );

  // Cho UI đẩy user message optimistic (tuỳ chọn dùng/không)
  const appendUserMessage = useCallback(
    (content: string) => {
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content,
          conversationId,
          ts: new Date().toISOString(),
        },
      ]);
    },
    [conversationId]
  );

  // Xóa tất cả messages (dùng khi bấm "Đoạn chat mới")
  const clearMessages = useCallback(() => {
    setMessages([]);
    setConversationId(undefined);
  }, []);

  return {
    isConnected,
    messages,         // realtime stream (assistant + user nếu có)
    conversationId,   // id thật khi server tạo
    askChatbot,
    appendUserMessage,
    clearMessages,
    groupId,
  };
}
