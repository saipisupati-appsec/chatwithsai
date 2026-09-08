"use client";

import { Message } from "@/lib/types";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}
    >
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-brand-600 text-white rounded-br-md"
            : "bg-white border border-slate-200 text-slate-800 rounded-bl-md shadow-sm"
        }`}
      >
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content.split("**").map((part, i) =>
            i % 2 === 1 ? (
              <strong key={i} className={isUser ? "font-semibold" : "font-semibold text-slate-900"}>
                {part}
              </strong>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </div>
      </div>
    </div>
  );
}
