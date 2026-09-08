"use client";

import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import SuggestedQuestions from "@/components/SuggestedQuestions";
import { Mode, Message } from "@/lib/types";
import { getMockResponse, SUGGESTED_QUESTIONS } from "@/lib/mock-responses";

export default function Home() {
  const [mode, setMode] = useState<Mode>("general");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    // Optional: clear messages on mode switch for cleaner demo
    // setMessages([]);
  };

  const handleSend = async (text: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate small network/processing delay for realism
    await new Promise((r) => setTimeout(r, 400 + Math.random() * 400));

    const responseText = getMockResponse(text, mode);

    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: responseText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  const handleSuggested = (question: string) => {
    if (isTyping) return;
    handleSend(question);
  };

  const showSuggestions = messages.length === 0;

  return (
    <div className="flex flex-col min-h-screen">
      <Header mode={mode} onModeChange={handleModeChange} />

      <main className="flex-1 flex flex-col max-w-4xl w-full mx-auto px-4 sm:px-6">
        {/* Empty state */}
        {showSuggestions && (
          <div className="flex-1 flex flex-col items-center justify-center py-12 sm:py-20">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-100 text-brand-700 mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.065 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                  />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
                Ask about Sai
              </h2>
              <p className="text-slate-600 max-w-md mx-auto text-sm sm:text-base">
                Professional AI profile for Balasubramanya Sai Kumar — Application
                Security experience, skills, projects, and career fit.
              </p>
            </div>

            <div className="w-full max-w-2xl">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3 text-center">
                Suggested questions
              </p>
              <SuggestedQuestions
                questions={SUGGESTED_QUESTIONS[mode]}
                onSelect={handleSuggested}
              />
            </div>

            {mode === "recruiter" && (
              <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl max-w-md text-center">
                <p className="text-sm text-amber-800">
                  <strong>Recruiter mode</strong> — Full job URL analysis &
                  deterministic matching will be available in a later phase.
                  For now you can ask about specific skills and experience.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Messages */}
        {!showSuggestions && (
          <div className="flex-1 overflow-y-auto py-6 space-y-4">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input area */}
        <div className="py-4 border-t border-slate-100 bg-slate-50/80 sticky bottom-0">
          {!showSuggestions && (
            <div className="mb-3">
              <SuggestedQuestions
                questions={SUGGESTED_QUESTIONS[mode].slice(0, 3)}
                onSelect={handleSuggested}
                disabled={isTyping}
              />
            </div>
          )}
          <ChatInput
            onSend={handleSend}
            disabled={isTyping}
            placeholder={
              mode === "recruiter"
                ? "Ask about Sai’s fit for a role or paste requirements..."
                : mode === "career"
                ? "Ask career or positioning questions..."
                : "Ask about Sai..."
            }
          />
          <p className="text-xs text-slate-400 text-center mt-2">
            ChatWithSai focuses only on Sai&apos;s professional profile. Phase 1 —
            deterministic mock responses.
          </p>
        </div>
      </main>
    </div>
  );
}
