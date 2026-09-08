"use client";

interface SuggestedQuestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
  disabled?: boolean;
}

export default function SuggestedQuestions({
  questions,
  onSelect,
  disabled,
}: SuggestedQuestionsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {questions.map((q) => (
        <button
          key={q}
          onClick={() => onSelect(q)}
          disabled={disabled}
          className="px-3 py-1.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-full text-slate-700 dark:text-slate-300 hover:border-brand-300 dark:hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-slate-700 hover:text-brand-800 dark:hover:text-brand-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {q}
        </button>
      ))}
    </div>
  );
}
