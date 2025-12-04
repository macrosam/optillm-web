"use client";

import React, { useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function HomePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const nextMessages: Message[] = [
      ...messages,
      { role: "user", content: input },
    ];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Request failed");
      }

      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: data.reply ?? "",
        },
      ]);
    } catch (err: any) {
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: "Error talking to OptiLLM: " + String(err?.message || err),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  return (
    <main
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "24px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1>OptiLLM Web Chat</h1>
      <p style={{ color: "#555", marginBottom: 16 }}>
        Vercel UI → Render-hosted OptiLLM.
      </p>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 16,
          minHeight: 300,
          marginBottom: 16,
          overflowY: "auto",
        }}
      >
        {messages.map((m, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: 12,
              whiteSpace: "pre-wrap",
            }}
          >
            <strong>{m.role === "user" ? "You" : "OptiLLM"}</strong>
            <div>{m.content}</div>
          </div>
        ))}
        {messages.length === 0 && (
          <div style={{ color: "#888" }}>
            Ask OptiLLM anything…
          </div>
        )}
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={3}
        style={{
          width: "100%",
          marginBottom: 8,
          padding: 8,
          fontFamily: "inherit",
        }}
        placeholder="Type a message…"
      />
      <button
        onClick={() => void sendMessage()}
        disabled={loading}
        style={{
          padding: "8px 16px",
          cursor: loading ? "wait" : "pointer",
        }}
      >
        {loading ? "Thinking…" : "Send"}
      </button>
    </main>
  );
}
