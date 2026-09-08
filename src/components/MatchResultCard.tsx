"use client";

interface MatchResultCardProps {
  formatted: string;
  questionsUsed: number;
  questionsMax: number;
  onAnalyzeAnother: () => void;
  onWhySai: () => void;
  onInterview: () => void;
}

export default function MatchResultCard({
  formatted,
  questionsUsed,
  questionsMax,
  onAnalyzeAnother,
  onWhySai,
  onInterview,
}: MatchResultCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Job analysis · {questionsUsed} / {questionsMax} follow-ups used
        </p>
        <button
          type="button"
          onClick={onAnalyzeAnother}
          className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline"
        >
          Analyze another job
        </button>
      </div>
      <div className="text-sm leading-relaxed whitespace-pre-wrap text-slate-800 dark:text-slate-100">
        {formatted.split("**").map((part, i) =>
          i % 2 === 1 ? (
            <strong key={i} className="font-semibold">
              {part}
            </strong>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </div>
      <div className="flex flex-wrap gap-2 pt-1">
        <button
          type="button"
          onClick={onWhySai}
          className="px-3 py-1.5 text-xs rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-800 dark:text-brand-200 border border-brand-200 dark:border-brand-800"
        >
          ✨ Why Sai?
        </button>
        <button
          type="button"
          onClick={onInterview}
          className="px-3 py-1.5 text-xs rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600"
        >
          🎤 Interview questions
        </button>
      </div>
    </div>
  );
}
