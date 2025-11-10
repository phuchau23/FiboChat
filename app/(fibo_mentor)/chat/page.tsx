"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatHeader from "./components/ChatHeader";
import QAPairSidebar from "./components/QAPair/QAPairSidebar";

import { useClassEnrollmentByUser } from "@/hooks/useGroupEnrollment";
import { getCookie } from "cookies-next";
import { decodeToken } from "@/utils/jwt";
import {
  useChatbotHub,
  UiMessage as HubUiMessage,
} from "@/hooks/useChatbotHub";
import {
  ConversationItem,
  fetchConversation,
} from "@/lib/api/services/fetchConversation";

import DOMPurify, { Config as DomPurifyConfig } from "isomorphic-dompurify";
import { motion, Variants, AnimatePresence } from "motion/react";
import {
  HistoryItem,
  HistoryResponse,
} from "@/lib/api/services/fetchHistoryChat";
import { ChatInputBar } from "./components/ChatInputBar";

/* ==============================
 * 1) Helpers & constants
 * ============================== */
type UiMsgRole = "user" | "assistant";
interface UiMessage {
  id?: string; // answerId nếu có
  role: UiMsgRole;
  content: string;
  conversationId?: string | null;
  ts: string; // ISO
}

interface JwtPayload {
  nameid?: unknown;
}
function getUserIdFromCookie(): string | undefined {
  const raw = getCookie("auth-token");
  const tokenStr = typeof raw === "string" ? raw : raw?.toString();
  if (!tokenStr) return undefined;
  const decoded = decodeToken(tokenStr) as unknown as JwtPayload;
  const id =
    decoded && typeof decoded === "object" ? decoded.nameid : undefined;
  return typeof id === "string" ? id : undefined;
}

/* ---- sanitize/HTML helpers ---- */
function stripCodeFenceToHtml(text: string): string | undefined {
  const m =
    text.match(/```(?:html|HTML)?\s*([\s\S]*?)```/i) ||
    text.match(/```([\s\S]*?)```/);
  if (!m) return;
  const inner = m[1]?.trim();
  if (!inner) return;
  return inner;
}
function isLikelyHTML(text: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(text);
}
const sanitizeConfig: DomPurifyConfig = {
  ALLOWED_TAGS: [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "p",
    "strong",
    "em",
    "u",
    "s",
    "br",
    "ul",
    "ol",
    "li",
    "blockquote",
    "code",
    "pre",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "a",
    "hr",
    "span",
    "div",
  ],
  ALLOWED_ATTR: ["href", "title", "target", "rel", "class", "style"],
  FORBID_TAGS: ["script", "iframe", "object", "embed"],
  FORBID_ATTR: [
    "onabort",
    "onblur",
    "onchange",
    "onclick",
    "onerror",
    "onfocus",
    "onload",
    "onmouseover",
    "onmouseenter",
    "onmouseleave",
    "onmousedown",
    "onmouseup",
    "onkeypress",
    "onkeydown",
    "onkeyup",
  ],
  ADD_ATTR: ["rel"],
  RETURN_TRUSTED_TYPE: false,
};

function sanitizeHtml(html: string): string {
  const cleaned = DOMPurify.sanitize(html, sanitizeConfig);
  return cleaned.replace(
    /<a\s+([^>]*href=['"][^'"]+['"][^>]*)>/gi,
    (_m, attrs) => `<a ${attrs} target="_blank" rel="noopener noreferrer">`
  );
}

/* ---- dedupe helpers ---- */
function simpleHash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return String(h);
}
function msgKey(m: UiMessage) {
  return m.id ?? `${m.role}__${m.ts}__${simpleHash(m.content)}`;
}
function mergeMessages(base: UiMessage[], incoming: UiMessage[]) {
  const seen = new Map<string, UiMessage>();
  for (const m of base) seen.set(msgKey(m), m);
  for (const m of incoming) {
    const k = msgKey(m);
    if (!seen.has(k)) seen.set(k, m);
  }
  return Array.from(seen.values()).sort(
    (a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime()
  );
}

/* ---- tiny UI pieces ---- */
function LoadingThreeDotsJumping({ className = "" }: { className?: string }) {
  const dotVariants: Variants = {
    jump: {
      y: -18,
      transition: {
        duration: 0.65,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      },
    },
  };
  return (
    <motion.div
      className={`inline-flex items-center gap-2 ${className}`}
      animate="jump"
      transition={{ staggerChildren: 0.12, staggerDirection: 1 }}
      aria-label="AI is typing"
    >
      <motion.span
        className="block w-2.5 h-2.5 rounded-full bg-gray-300"
        variants={dotVariants}
      />
      <motion.span
        className="block w-2.5 h-2.5 rounded-full bg-gray-300"
        variants={dotVariants}
      />
      <motion.span
        className="block w-2.5 h-2.5 rounded-full bg-gray-300"
        variants={dotVariants}
      />
    </motion.div>
  );
}

function TypewriterText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    let i = 0,
      stop = false;
    const step = () => {
      if (stop) return;
      setShown(text.slice(0, i + 1));
      i++;
      if (i >= text.length) return;
      const ch = text[i - 1];
      const base = 14 + Math.random() * 14;
      const extra = /[.,!?;:…]/.test(ch)
        ? 140 + Math.random() * 120
        : ch === " "
        ? 20
        : 0;
      setTimeout(step, base + extra);
    };
    setShown("");
    if (text) setTimeout(step, 60);
    return () => {
      stop = true;
    };
  }, [text]);

  return (
    <span className={className} style={{ whiteSpace: "pre-wrap" }}>
      {shown}
      {shown.length < text.length && (
        <span
          className="inline-block w-3"
          style={{
            borderRight: "2px solid rgba(0,0,0,0.35)",
            animation: "blink 1s step-end infinite",
            height: "1em",
            transform: "translateY(1px)",
          }}
        />
      )}
      <style>{`@keyframes blink { 50% { border-color: transparent; } }`}</style>
    </span>
  );
}

/* ========= NEW: TypewriterHTML (gõ từng chữ nhưng giữ cấu trúc tag hợp lệ) ========= */
function tokenizeHtml(
  html: string
): Array<{ type: "tag" | "text"; value: string }> {
  const parts = html.split(/(<[^>]+>)/g).filter(Boolean);
  return parts.map((p) =>
    p.startsWith("<") && p.endsWith(">")
      ? { type: "tag", value: p }
      : { type: "text", value: p }
  );
}

function TypewriterHTML({
  html,
  className,
  cursor = true,
  baseMin = 14,
  baseRand = 14,
  punctHoldMin = 140,
  punctHoldRand = 120,
}: {
  html: string;
  className?: string;
  cursor?: boolean;
  baseMin?: number;
  baseRand?: number;
  punctHoldMin?: number;
  punctHoldRand?: number;
}) {
  const [rendered, setRendered] = useState<string>("");
  const tokensRef = useRef<{ type: "tag" | "text"; value: string }[]>([]);
  const idxRef = useRef<number>(0);
  const charRef = useRef<number>(0);
  const stopRef = useRef<boolean>(false);

  useEffect(() => {
    tokensRef.current = tokenizeHtml(html);
    idxRef.current = 0;
    charRef.current = 0;
    stopRef.current = false;
    setRendered("");

    const step = () => {
      if (stopRef.current) return;
      const tokens = tokensRef.current;
      const ti = idxRef.current;
      if (ti >= tokens.length) return; // done

      const tk = tokens[ti];

      if (tk.type === "tag") {
        // Đẩy nguyên tag để DOM luôn hợp lệ
        setRendered((prev) => prev + tk.value);
        idxRef.current = ti + 1;
        charRef.current = 0;
        queueMicrotask(step);
        return;
      }

      // tk.type === "text": gõ từng ký tự
      const nextChar = tk.value.charAt(charRef.current);

      setRendered((prev) => {
        const before = prev;
        // nếu phần cuối trước đó khớp phần đã gõ -> append 1 ký tự
        const alreadyTyped = tk.value.slice(0, charRef.current);
        if (alreadyTyped.length === 0 || before.endsWith(alreadyTyped)) {
          return before + nextChar;
        }
        // fallback an toàn: vẫn append (đảm bảo không crash UI)
        return before + nextChar;
      });

      charRef.current += 1;

      const isTokenDone = charRef.current >= tk.value.length;
      const delay =
        baseMin +
        Math.random() * baseRand +
        (/[.,!?;:…]/.test(nextChar)
          ? punctHoldMin + Math.random() * punctHoldRand
          : nextChar === " "
          ? 20
          : 0);

      if (isTokenDone) {
        idxRef.current = ti + 1;
        charRef.current = 0;
      }

      setTimeout(step, delay);
    };

    setTimeout(step, 60);

    return () => {
      stopRef.current = true;
    };
  }, [html, baseMin, baseRand, punctHoldMin, punctHoldRand]);

  return (
    <span className={className}>
      <span
        className="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: rendered }}
      />
      {cursor && (
        <span
          className="inline-block w-3 align-middle"
          style={{
            borderRight: "2px solid rgba(0,0,0,0.35)",
            animation: "blink 1s step-end infinite",
            height: "1em",
            transform: "translateY(1px)",
          }}
        />
      )}
      <style>{`@keyframes blink { 50% { border-color: transparent; } }`}</style>
    </span>
  );
}

/* ==============================
 * 2) History mapping
 * ============================== */
function mapHistoryToUiMessages(
  items: HistoryItem[],
  convId?: string
): UiMessage[] {
  const out: UiMessage[] = [];
  for (const it of items) {
    out.push({
      role: "user",
      content: it.questionText ?? "",
      conversationId: convId,
      ts: it.questionCreatedAt,
    });
    for (const ans of it.answers ?? []) {
      out.push({
        id: ans.answerId, // nếu BE có id thì set
        role: "assistant",
        content: ans.answerContent ?? "",
        conversationId: convId,
        ts: ans.answerCreatedAt,
      });
    }
  }
  return out;
}

/* ==============================
 * 3) Page Component
 * ============================== */
export default function FiboMentor() {
  /* ---- 3.1 Identity / Group ---- */
  const userId = getUserIdFromCookie();
  const { data: enrollment } = useClassEnrollmentByUser(userId);
  const groupId = enrollment?.group?.id;

  /* ---- 3.2 Sidebar state ---- */
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);

  /* ---- 3.3 History / pending / realtime ---- */
  const [historyMsgs, setHistoryMsgs] = useState<UiMessage[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [pendingMsgs, setPendingMsgs] = useState<UiMessage[]>([]);
  const [realtimeMsgs, setRealtimeMsgs] = useState<UiMessage[]>([]);
  const pendingMsgsRef = useRef<UiMessage[]>([]);

  /** Mốc thời gian khi bấm "Đoạn chat mới" để lọc realtime cũ không có conversationId */
  const [newChatStartAt, setNewChatStartAt] = useState<string | null>(null);

  // Cập nhật ref mỗi khi pendingMsgs thay đổi
  useEffect(() => {
    pendingMsgsRef.current = pendingMsgs;
  }, [pendingMsgs]);

  /* ---- 3.4 SignalR hook ---- */
  const {
    isConnected,
    messages: hubMessages,
    conversationId: hubConversationId,
    askChatbot,
    clearMessages,
  } = useChatbotHub(userId);

  // normalize hub messages -> realtimeMsgs (replace, không merge)
  useEffect(() => {
    const normalized: UiMessage[] = hubMessages.map((m: HubUiMessage) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      conversationId: m.conversationId,
      ts: m.ts,
    }));
    setRealtimeMsgs(normalized); // REPLACE thay vì merge
  }, [hubMessages]);

  /* ---- 3.5 Load conversation list ---- */
  useEffect(() => {
    if (!groupId) return;
    fetchConversation
      .getByGroup(groupId)
      .then((data) => setConversations(data.data.items))
      .catch((err) => console.error("❌ Load conversations failed:", err));
  }, [groupId]);

  /* ---- 3.6 Load history API ---- */
  const loadConversationHistory = useCallback(async (convId: string) => {
    const token = getCookie("auth-token");
    if (!token) return;
    setIsHistoryLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/course/api/conversations/${convId}/history`,
        {
          method: "GET",
          headers: {
            accept: "text/plain",
            Authorization: `Bearer ${
              typeof token === "string" ? token : token.toString()
            }`,
          },
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as HistoryResponse;
      const mapped = mapHistoryToUiMessages(
        json?.data?.history ?? [],
        json?.data?.conversationId
      );
      setHistoryMsgs(mapped); // replace (history là ground truth)
    } catch (err) {
      console.error("❌ Load history failed:", err);
      setHistoryMsgs([]);
    } finally {
      setIsHistoryLoading(false);
    }
  }, []);

  /* ---- 3.7 Select conversation from Sidebar ---- */
  const handleSelectConversation = useCallback(
    (id: string) => {
      setSelectedConversationId(id);
      setPendingMsgs([]); // clear optimistic của conv khác
      setMessage(""); // clear input
      setIsDocked(true); // đã vào conv -> dock
      setNewChatStartAt(null); // không còn ở trạng thái New chat
      loadConversationHistory(id);
    },
    [loadConversationHistory]
  );

  /* ---- 3.8 New chat ---- */
  const handleNewChat = useCallback(() => {
    clearMessages(); // XÓA messages trong hub hook (effect sẽ tự sync realtimeMsgs)
    setSelectedConversationId(null);
    setHistoryMsgs([]);
    setPendingMsgs([]);
    setMessage("");
    setIsDocked(false); // quay về hero
    setNewChatStartAt(new Date().toISOString()); // mốc lọc realtime mới
  }, [clearMessages]);

  /* ---- 3.9 Compose render list ---- */
  const realtimeForSelected: UiMessage[] = useMemo(() => {
    if (selectedConversationId === null) {
      // new chat: chỉ lấy hub msg KHÔNG có conversationId và tới sau mốc newChatStartAt
      return realtimeMsgs.filter((m) => {
        if (m.conversationId) return false;
        if (!newChatStartAt) return false;
        return new Date(m.ts).getTime() >= new Date(newChatStartAt).getTime();
      });
    }
    // chat cũ: chỉ lấy đúng id
    return realtimeMsgs.filter(
      (m) => m.conversationId === selectedConversationId
    );
  }, [realtimeMsgs, selectedConversationId, newChatStartAt]);

  const pendingForSelected = useMemo(
    () =>
      pendingMsgs.filter((m) => m.conversationId === selectedConversationId),
    [pendingMsgs, selectedConversationId]
  );

  const allMessages: UiMessage[] = useMemo(
    () =>
      mergeMessages(
        mergeMessages(historyMsgs, pendingForSelected),
        realtimeForSelected
      ),
    [historyMsgs, pendingForSelected, realtimeForSelected]
  );

  const lastAssistantIndex = useMemo(() => {
    for (let i = allMessages.length - 1; i >= 0; i--) {
      if (allMessages[i].role === "assistant") return i;
    }
    return -1;
  }, [allMessages]);

  const hasAnyMessage = allMessages.length > 0;

  /* ---- 3.10 Sync convId khi đang new chat + promote pending ---- */
  useEffect(() => {
    if (!hubConversationId) return;
    if (selectedConversationId === null) {
      setSelectedConversationId(hubConversationId);
      // promote pending (convId null) sang convId thật để không lặp
      setPendingMsgs((prev) =>
        prev.map((m) => ({ ...m, conversationId: hubConversationId }))
      );
      setIsDocked(true);
      setNewChatStartAt(null); // đã có conv thật

      // Thêm conversation mới vào sidebar nếu chưa có
      setConversations((prev) => {
        if (prev.some((c) => c.id === hubConversationId)) return prev;

        const firstQuestion = pendingMsgsRef.current.find(
          (m) => m.role === "user"
        )?.content;
        const title = firstQuestion
          ? firstQuestion.slice(0, 50) +
            (firstQuestion.length > 50 ? "..." : "")
          : "Đoạn chat mới";

        const newConv: ConversationItem = {
          id: hubConversationId,
          createById: userId || "",
          classId: "",
          groupId: groupId || "",
          title,
          status: "active",
          createdAt: new Date().toISOString(),
          updatedAt: null,
          messageCount: 0,
          questionCount: 1,
        };

        return [newConv, ...prev];
      });
    }
  }, [hubConversationId, selectedConversationId, userId, groupId]);

  /* ---- 3.11 Input/Send/Stop ---- */
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDocked, setIsDocked] = useState(false);

  const handleSend = useCallback(async () => {
    const text = message.trim();
    if (!text || !userId) return;

    if (!isDocked) setIsDocked(true); // <-- chỉ dock lần đầu khi gửi

    setPendingMsgs((prev) => [
      ...prev,
      {
        role: "user",
        content: text,
        conversationId: selectedConversationId,
        ts: new Date().toISOString(),
      },
    ]);
    setMessage("");
    setIsLoading(true);

    try {
      await askChatbot(text, selectedConversationId);
    } finally {
      setIsLoading(false);
    }
  }, [askChatbot, message, selectedConversationId, userId, isDocked]);

  /* ---- 3.13 Handle QA Pair Prompt ---- */
  const handleUsePrompt = useCallback(
    (question: string) => {
      setMessage(question);
      if (!isDocked) setIsDocked(true);
    },
    [isDocked]
  );

  /* ---- 3.12 Auto-scroll mượt ---- */
  const listRef = useRef<HTMLDivElement | null>(null);
  // auto scroll xuống đáy khi có message mới nếu đang ở gần đáy
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (nearBottom) {
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight;
      });
    }
  }, [allMessages.length, selectedConversationId]);

  // khi load xong history của conv mới -> scroll đáy
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    if (!isHistoryLoading) {
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight;
      });
    }
  }, [isHistoryLoading, selectedConversationId]);

  /* ==============================
   * 4) Render
   * ============================== */
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar
        conversations={conversations}
        selectedConversationId={selectedConversationId || ""}
        onSelect={handleSelectConversation}
        onNewChat={handleNewChat}
      />

      <div className="flex-1 flex flex-col">
        <ChatHeader
          selectedTopic={{ id: 1, name: "SWP" }}
          setSelectedTopic={() => {}}
          mockTopics={[{ id: 1, name: "SWP" }]}
        />

        <div className="flex-1 overflow-hidden flex p-4 gap-3 bg-[#f8fafc] ">
          {/* Chat Area */}

          <div className="flex-1 flex flex-col bg-white border rounded-lg py-2 overflow-hidden">
            <div className="h-full w-full max-w-3xl mx-auto flex flex-col relative">
              {/* ===== Hero chào + input ở giữa (khi chưa dock) ===== */}
              <AnimatePresence>
                {!hasAnyMessage && !isHistoryLoading && !isDocked && (
                  <motion.div
                    key="hero"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex-1 flex flex-col mt-16 items-center justify-center md:justify-center md:pt-16 text-center px-6"
                  >
                    <h2 className="text-xl md:text-xl font-semibold text-gray-800 mb-8">
                      Xin chào, bạn đang cần hỗ trợ gì ?
                    </h2>
                    <motion.div
                      layoutId="chat-input"
                      className="w-full max-w-2xl"
                    >
                      <ChatInputBar
                        message={message}
                        setMessage={setMessage}
                        isConnected={isConnected}
                        isLoading={isLoading}
                        onSend={handleSend}
                        autoFocus
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Loading history */}
              {isHistoryLoading && (
                <div className="text-left px-4 md:px-0">
                  <LoadingThreeDotsJumping className="mt-3" />
                </div>
              )}

              {/* Danh sách tin nhắn */}
              <div
                ref={listRef}
                className="
                flex-1 overflow-y-auto px-4 md:px-0 py-6 space-y-6
                [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
              "
              >
                {allMessages.map((m, idx) => {
                  const isUser = m.role === "user";
                  const align = isUser ? "text-right" : "text-left";

                  const fromFence = stripCodeFenceToHtml(m.content ?? "");
                  const candidate = fromFence ?? m.content;

                  const shouldRenderHTML = !isUser && isLikelyHTML(candidate);
                  const safeHTML = shouldRenderHTML
                    ? sanitizeHtml(candidate)
                    : undefined;

                  const isLastAssistant = !isUser && idx === lastAssistantIndex;
                  const useTypewriterText =
                    isLastAssistant && !shouldRenderHTML;
                  const useTypewriterHtml = isLastAssistant && !!safeHTML;

                  return (
                    <div key={msgKey(m)} className={align} title={m.ts}>
                      <div
                        className={`group inline-block max-w-full ${
                          isUser
                            ? "bg-[#f3f3f3] px-3 py-2 border-none rounded-xl"
                            : ""
                        }`}
                      >
                        {/* Nội dung */}
                        {useTypewriterHtml ? (
                          <TypewriterHTML
                            html={safeHTML!}
                            className="text-[15px] leading-relaxed prose prose-sm dark:prose-invert max-w-none"
                          />
                        ) : shouldRenderHTML ? (
                          <div
                            className="text-[15px] leading-relaxed prose prose-sm dark:prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: safeHTML! }}
                          />
                        ) : useTypewriterText ? (
                          <TypewriterText
                            text={candidate}
                            className="text-[15px] leading-relaxed text-gray-900"
                          />
                        ) : (
                          <div
                            className="text-[15px] leading-relaxed text-gray-900"
                            style={{ whiteSpace: "pre-wrap" }}
                          >
                            {candidate}
                          </div>
                        )}

                        {/* Hàng nút dưới cùng (AI only, hover-only) */}
                        {!isUser && (
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-2 flex items-center gap-2">
                            <button
                              onClick={() => {
                                const toCopy = shouldRenderHTML
                                  ? sanitizeHtml(candidate)
                                  : candidate;
                                navigator.clipboard.writeText(toCopy ?? "");
                              }}
                              className="px-2 py-1 text-[12px] border rounded-md bg-white/80 hover:bg-white"
                              title="Sao chép"
                              aria-label="Copy"
                            >
                              Sao chép
                            </button>

                            <button
                              onClick={() => {
                                console.log(
                                  "[Report] answerId:",
                                  m.id || "(none)",
                                  { message: m }
                                );
                              }}
                              className="px-2 py-1 text-[12px] border rounded-md bg-white/80 hover:bg-white"
                              title="Báo cáo"
                              aria-label="Report"
                            >
                              Báo cáo
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="text-left">
                    <LoadingThreeDotsJumping className="mt-1" />
                  </div>
                )}
              </div>

              {/* ===== Input sticky đáy sau khi dock hoặc có message ===== */}
              <AnimatePresence>
                {(isDocked || hasAnyMessage) && (
                  <motion.div
                    key="dock"
                    layout
                    className="px-4 md:px-0 pb-5 pt-3 sticky bottom-0 "
                  >
                    <motion.div layoutId="chat-input">
                      <ChatInputBar
                        message={message}
                        setMessage={setMessage}
                        isConnected={isConnected}
                        isLoading={isLoading}
                        onSend={handleSend}
                        autoFocus={isDocked && !hasAnyMessage}
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* QA Pair Sidebar */}
          <QAPairSidebar onUsePrompt={handleUsePrompt} />
        </div>
      </div>
    </div>
  );
}
