"use client";

import { brand } from "@/config/brand";
import type { Mode } from "@/lib/types";

interface QuickActionsProps {
  mode: Mode;
  hasJob: boolean;
  onAction: (prompt: string) => void;
  onAnalyzeJob?: () => void;
}

export default function QuickActions({
  mode,
  hasJob,
  onAction,
  onAnalyzeJob,
}: QuickActionsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <a
        href={brand.resumePath}
        download
        className="px-3 py-1.5 text-xs rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-brand-300"
      >
        📄 {brand.resumeLabel}
      </a>
      {(mode === "recruiter" || mode === "general" || mode === "career") && (
        <button
          type="button"
          onClick={() => onAnalyzeJob?.()}
          className="px-3 py-1.5 text-xs rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
        >
          🎯 Analyze a Job
        </button>
      )}
      {mode === "recruiter" && hasJob && (
        <>
          <button
            type="button"
            onClick={() => onAction("Why Sai?")}
            className="px-3 py-1.5 text-xs rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
          >
            ✨ Why Sai?
          </button>
          <button
            type="button"
            onClick={() => onAction("What should I ask Sai in an interview?")}
            className="px-3 py-1.5 text-xs rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
          >
            🎤 Interview questions
          </button>
        </>
      )}
      {mode !== "recruiter" && (
        <>
          <button
            type="button"
            onClick={() => onAction("What security experience does Sai have?")}
            className="px-3 py-1.5 text-xs rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
          >
            🛡️ Security Experience
          </button>
          <button
            type="button"
            onClick={() => onAction("What security projects has Sai worked on?")}
            className="px-3 py-1.5 text-xs rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
          >
            🚀 Projects
          </button>
          <button
            type="button"
            onClick={() => onAction("Tell me about Sai's career")}
            className="px-3 py-1.5 text-xs rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
          >
            💼 Career Journey
          </button>
        </>
      )}
    </div>
  );
}
