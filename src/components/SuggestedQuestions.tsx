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
          className="px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-full text-slate-700 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {q}
        </button>
      ))}
    </div>
  );
}
