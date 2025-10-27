"use client";
import React, { useState } from "react";

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState([
    { from: "lecture1", to: "Nguyen Van A", message: "Bạn cần hỗ trợ gì không?", timestamp: "2025-10-15T08:00:00Z" },
  ]);
  const [message, setMessage] = useState("");
  const [to, setTo] = useState("Nguyen Van A");

  const sendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { from: "lecture1", to, message, timestamp: new Date().toISOString() }]);
      setMessage("");
    }
  };

  return (
    <section style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
      <h2 style={{ color: "#fa7a1c", fontSize: 20, marginBottom: 16 }}>ChatBox</h2>
      <div style={{ marginBottom: 16 }}>
        <select
          value={to}
          onChange={(e) => setTo(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #fa7a1c", width: "100%" }}
        >
          {[...new Set(messages.map((m) => m.to))].map((name) => (
            <option value={name} key={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div
        style={{
          maxHeight: 180,
          overflowY: "auto",
          background: "#fff7f1",
          borderRadius: 8,
          padding: 12,
          marginBottom: 8,
        }}
      >
        {messages
          .filter((m) => m.to === to || m.from === to)
          .map((msg, idx) => (
            <div key={idx} style={{ marginBottom: 8, color: "#333" }}>
              <b style={{ color: "#fa7a1c" }}>{msg.from}</b> to <b>{msg.to}</b>: {msg.message}{" "}
              <i style={{ fontSize: 12, color: "#888" }}>{new Date(msg.timestamp).toLocaleTimeString()}</i>
            </div>
          ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message..."
          style={{ flex: 1, padding: "8px 12px", border: "1px solid #fa7a1c", borderRadius: 8 }}
        />
        <button
          onClick={sendMessage}
          style={{ padding: "8px 16px", background: "#fa7a1c", color: "#fff", border: "none", borderRadius: 8 }}
        >
          Send
        </button>
      </div>
    </section>
  );
};

export default ChatBox;
