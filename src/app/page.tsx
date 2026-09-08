"use client";

import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import SuggestedQuestions from "@/components/SuggestedQuestions";
import JobAnalyzePanel from "@/components/JobAnalyzePanel";
import MatchResultCard from "@/components/MatchResultCard";
import QuickActions from "@/components/QuickActions";
import {
  atmosphereClassName,
  loadStoredAtmosphere,
} from "@/components/AtmosphereSelector";
import { Mode, Message } from "@/lib/types";
import {
  dynamicSuggestions,
  type TopicId,
} from "@/lib/answers";
import { brand } from "@/config/brand";
import type { AtmosphereId } from "@/config/themes";

const QUESTIONS_MAX = 10;

export default function Home() {
  const [mode, setMode] = useState<Mode>("general");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [matchFormatted, setMatchFormatted] = useState<string | null>(null);
  const [questionsUsed, setQuestionsUsed] = useState(0);
  const [lastTopic, setLastTopic] = useState<TopicId | null>(null);
  const [showJobPanel, setShowJobPanel] = useState(true);
  const [atmosphere, setAtmosphere] = useState<AtmosphereId>("auto");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAtmosphere(loadStoredAtmosphere());
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, matchFormatted]);

  const hasJob = Boolean(sessionId && matchFormatted);

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    if (newMode === "recruiter") setShowJobPanel(true);
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
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        role: "user",
        content: text,
        timestamp: new Date(),
      },
    ]);
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          mode,
          sessionId: mode === "recruiter" ? sessionId : undefined,
          lastTopic,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        appendAssistant(
          data.error ||
            "Something went wrong. Please try again or switch modes."
        );
        if (typeof data.questionsRemaining === "number") {
          setQuestionsUsed(QUESTIONS_MAX - data.questionsRemaining);
        }
        return;
      }

      appendAssistant(data.reply);
      if (data.topic) setLastTopic(data.topic as TopicId);
      if (typeof data.questionsRemaining === "number") {
        setQuestionsUsed(QUESTIONS_MAX - data.questionsRemaining);
      }
      if (data.sessionId) setSessionId(data.sessionId);
    } catch {
      appendAssistant("Network error. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleJobAnalyzed = (payload: {
    sessionId: string;
    formatted: string;
    questionsRemaining: number;
  }) => {
    setSessionId(payload.sessionId);
    setMatchFormatted(payload.formatted);
    setQuestionsUsed(0);
    setShowJobPanel(false);
    setMessages((prev) => [
      ...prev,
      {
        id: `assistant-job-${Date.now()}`,
        role: "assistant",
        content:
          "Here's the deterministic fit analysis. Ask follow-ups about gaps, strengths, or interview angles — up to 10 questions for this job.",
        timestamp: new Date(),
      },
    ]);
  };

  const resetRecruiterJob = () => {
    setSessionId(null);
    setMatchFormatted(null);
    setQuestionsUsed(0);
    setShowJobPanel(true);
  };

  const suggestions = dynamicSuggestions(mode, lastTopic, hasJob);
  const emptyChat = messages.length === 0 && !hasJob;
  const atmoClass = atmosphereClassName(atmosphere);

  return (
    <div
      className={`flex flex-col min-h-screen bg-slate-50/90 dark:bg-slate-900/90 ${atmoClass}`}
    >
      <Header
        mode={mode}
        onModeChange={handleModeChange}
        atmosphere={atmosphere}
        onAtmosphereChange={setAtmosphere}
      />

      <main className="flex-1 flex flex-col max-w-4xl w-full mx-auto px-4 sm:px-6">
        <div className="pt-3 pb-1 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-600 dark:text-slate-300">
              🔎 {brand.verifiedLabel}
            </span>
            {" · "}
            {brand.verifiedHint}
          </p>
        </div>

        {emptyChat && (
          <div className="flex-1 flex flex-col items-center justify-center py-10 sm:py-16 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 mb-5 text-2xl">
                💬
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                {brand.tagline.replace(/\.$/, "")}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto text-sm">
                Professional profile conversation — experience, tools, projects,
                and job fit. No invented skills.
              </p>
            </div>

            <QuickActions
              mode={mode}
              hasJob={false}
              onAction={handleSend}
              onAnalyzeJob={() => {
                setMode("recruiter");
                setShowJobPanel(true);
              }}
            />

            {mode === "recruiter" && showJobPanel ? (
              <JobAnalyzePanel
                onAnalyzed={handleJobAnalyzed}
                disabled={isTyping}
              />
            ) : (
              <div className="w-full max-w-2xl space-y-2">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center">
                  Try asking
                </p>
                <SuggestedQuestions
                  questions={suggestions}
                  onSelect={handleSend}
                />
              </div>
            )}
          </div>
        )}

        {!emptyChat && (
          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {mode === "recruiter" && hasJob && matchFormatted && (
              <MatchResultCard
                formatted={matchFormatted}
                questionsUsed={questionsUsed}
                questionsMax={QUESTIONS_MAX}
                onAnalyzeAnother={resetRecruiterJob}
                onWhySai={() => handleSend("Why Sai?")}
                onInterview={() =>
                  handleSend("What should I ask Sai in an interview?")
                }
              />
            )}

            {mode === "recruiter" && showJobPanel && !hasJob && (
              <JobAnalyzePanel
                onAnalyzed={handleJobAnalyzed}
                disabled={isTyping}
              />
            )}

            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        <div className="py-4 border-t border-slate-200/60 dark:border-slate-800 bg-transparent sticky bottom-0 space-y-3">
          {!emptyChat && (
            <>
              <QuickActions
                mode={mode}
                hasJob={hasJob}
                onAction={handleSend}
                onAnalyzeJob={() => {
                  setMode("recruiter");
                  if (hasJob) resetRecruiterJob();
                  else setShowJobPanel(true);
                }}
              />
              <SuggestedQuestions
                questions={suggestions.slice(0, 4)}
                onSelect={handleSend}
                disabled={isTyping}
              />
            </>
          )}
          <ChatInput
            onSend={handleSend}
            disabled={isTyping}
            placeholder={
              mode === "recruiter"
                ? hasJob
                  ? "Ask about this match, gaps, or interview angles…"
                  : "Paste a question, or analyze a job above…"
                : mode === "career"
                ? "Career positioning, gaps, what to emphasize…"
                : "Ask about Sai…"
            }
          />
        </div>
      </main>
    </div>
  );
}
