"use client";

import { useState } from "react";

interface JobAnalyzePanelProps {
  onAnalyzed: (payload: {
    sessionId: string;
    formatted: string;
    questionsRemaining: number;
  }) => void;
  disabled?: boolean;
}

export default function JobAnalyzePanel({
  onAnalyzed,
  disabled,
}: JobAnalyzePanelProps) {
  const [jobUrl, setJobUrl] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    if (!jobUrl.trim() && !jobDescription.trim()) {
      setError("Provide a job URL or paste a job description.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/jobs/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobUrl: jobUrl.trim() || undefined,
          jobDescription: jobDescription.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Analysis failed.");
        return;
      }
      onAnalyzed({
        sessionId: data.sessionId,
        formatted: data.formatted,
        questionsRemaining: data.questionsRemaining,
      });
      setJobUrl("");
      setJobDescription("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
        Analyze a job against Sai&apos;s profile
      </h3>
      <input
        type="url"
        value={jobUrl}
        onChange={(e) => setJobUrl(e.target.value)}
        placeholder="https://… job posting URL (HTTPS only)"
        disabled={disabled || loading}
        className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
      />
      <p className="text-xs text-slate-500 dark:text-slate-400 text-center">or</p>
      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Paste job description here…"
        rows={4}
        disabled={disabled || loading}
        className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 resize-y"
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      <button
        type="button"
        onClick={submit}
        disabled={disabled || loading}
        className="w-full rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium py-2.5 disabled:opacity-50 transition-colors"
      >
        {loading ? "Analyzing…" : "Analyze job fit"}
      </button>
      <p className="text-xs text-slate-400 dark:text-slate-500">
        Deterministic matching · SSRF-protected URL fetch · Max 10 follow-up questions
      </p>
    </div>
  );
}
