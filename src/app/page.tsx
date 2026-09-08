"use client";

import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import SuggestedQuestions from "@/components/SuggestedQuestions";
import JobAnalyzePanel from "@/components/JobAnalyzePanel";
import { Mode, Message } from "@/lib/types";
import { SUGGESTED_QUESTIONS } from "@/lib/mock-responses";

export default function Home() {
  const [mode, setMode] = useState<Mode>("general");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questionsRemaining, setQuestionsRemaining] = useState<number | null>(
    null
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
  };

  const appendAssistant = (content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content,
        timestamp: new Date(),
      },
    ]);
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

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          mode,
          sessionId: mode === "recruiter" ? sessionId : undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        appendAssistant(
          data.error ||
            "Something went wrong. Please try again or switch modes."
        );
        if (typeof data.questionsRemaining === "number") {
          setQuestionsRemaining(data.questionsRemaining);
        }
        return;
      }

      appendAssistant(data.reply);
      if (typeof data.questionsRemaining === "number") {
        setQuestionsRemaining(data.questionsRemaining);
      }
      if (data.sessionId) setSessionId(data.sessionId);
    } catch {
      appendAssistant("Network error. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggested = (question: string) => {
    if (isTyping) return;
    handleSend(question);
  };

  const handleJobAnalyzed = (payload: {
    sessionId: string;
    formatted: string;
    questionsRemaining: number;
  }) => {
    setSessionId(payload.sessionId);
    setQuestionsRemaining(payload.questionsRemaining);
    setMessages((prev) => [
      ...prev,
      {
        id: `assistant-job-${Date.now()}`,
        role: "assistant",
        content: payload.formatted,
        timestamp: new Date(),
      },
    ]);
  };

  const showSuggestions = messages.length === 0;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header mode={mode} onModeChange={handleModeChange} />

      <main className="flex-1 flex flex-col max-w-4xl w-full mx-auto px-4 sm:px-6">
        {showSuggestions && (
          <div className="flex-1 flex flex-col items-center justify-center py-12 sm:py-20 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 mb-6">
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
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                Ask about Sai
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto text-sm sm:text-base">
                Professional AI profile for Balasubramanya Sai Kumar — Application
                Security experience, skills, projects, and career fit.
              </p>
            </div>

            {mode === "recruiter" ? (
              <JobAnalyzePanel
                onAnalyzed={handleJobAnalyzed}
                disabled={isTyping}
              />
            ) : (
              <div className="w-full max-w-2xl">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 text-center">
                  Suggested questions
                </p>
                <SuggestedQuestions
                  questions={SUGGESTED_QUESTIONS[mode]}
                  onSelect={handleSuggested}
                />
              </div>
            )}
          </div>
        )}

        {!showSuggestions && (
          <div className="flex-1 overflow-y-auto py-6 space-y-4">
            {mode === "recruiter" && sessionId && (
              <div className="text-xs text-center text-slate-500 dark:text-slate-400">
                Recruiter session active
                {questionsRemaining !== null &&
                  ` · ${questionsRemaining} follow-up question${
                    questionsRemaining === 1 ? "" : "s"
                  } remaining`}
              </div>
            )}
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
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

        <div className="py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 sticky bottom-0">
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
                ? "Follow-up about this job analysis…"
                : mode === "career"
                ? "Ask career or positioning questions…"
                : "Ask about Sai…"
            }
          />
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-2">
            ChatWithSai · Knowledge v1.0.0 · Deterministic-first
          </p>
        </div>
      </main>
    </div>
  );
}
