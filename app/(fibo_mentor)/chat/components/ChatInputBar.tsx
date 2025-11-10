"use client";

/* ---- shared Chat Input Bar ---- */
export function ChatInputBar({
  message,
  setMessage,
  isConnected,
  isLoading,
  onSend,
  autoFocus = false,
}: {
  message: string;
  setMessage: (v: string) => void;
  isConnected: boolean;
  isLoading: boolean;
  onSend: () => void | Promise<void>;
  autoFocus?: boolean;
}) {
  const canSend = message.trim().length > 0 && isConnected && !isLoading;

  return (
    <div className="relative w-full items-center gap-3 border border-gray-200 rounded-2xl bg-white px-4 py-3 shadow-sm">
      {/* Input (giữ đúng CSS đẹp như trạng thái chưa gửi) */}
      <input
        className="flex-1 pb-3 w-full outline-none text-[15px] text-gray-800 placeholder:text-gray-400 bg-transparent"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && canSend) onSend();
        }}
        placeholder={
          isConnected
            ? "Ask anything about the SWP project..."
            : "Đang kết nối..."
        }
        disabled={!isConnected || isLoading}
        autoFocus={autoFocus}
      />

      {/* Hàng dưới: avatar + send */}
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#ff811b] text-white text-xs font-medium">
            FB
          </div>
          <span className="text-[14px] leading-none text-gray-500">
            Dr.Fibo
          </span>
        </div>

        <div className="flex items-center">
          {!isLoading ? (
            <button
              className={`inline-flex items-center justify-center w-9 h-9 rounded-full transition ${
                canSend
                  ? "bg-[#ff811b] hover:bg-[#ff811b] text-white"
                  : "bg-[#ff9c4b] text-white cursor-not-allowed"
              }`}
              onClick={() => canSend && onSend()}
              disabled={!canSend}
              aria-label="Send"
              title="Send"
            >
              {/* Paper plane icon */}
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 2L11 13" />
                <path d="M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin" />
          )}
        </div>
      </div>
    </div>
  );
}
