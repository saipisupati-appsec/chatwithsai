"use client";

import { Mode } from "@/lib/types";

interface HeaderProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
}

export default function Header({ mode, onModeChange }: HeaderProps) {
  const modes: { id: Mode; label: string }[] = [
    { id: "general", label: "General" },
    { id: "recruiter", label: "Recruiter" },
    { id: "career", label: "Career" },
  ];

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              ChatWithSai
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">Ask about Sai.</p>
          </div>

          <nav className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => onModeChange(m.id)}
                className={`px-3 sm:px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  mode === m.id
                    ? "bg-white text-brand-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {m.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
