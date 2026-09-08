"use client";

import { Mode } from "@/lib/types";
import ThemeToggle from "./ThemeToggle";
import AtmosphereSelector from "./AtmosphereSelector";
import { brand } from "@/config/brand";
import type { AtmosphereId } from "@/config/themes";

interface HeaderProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  atmosphere: AtmosphereId;
  onAtmosphereChange: (id: AtmosphereId) => void;
}

export default function Header({
  mode,
  onModeChange,
  atmosphere,
  onAtmosphereChange,
}: HeaderProps) {
  const modes: { id: Mode; label: string }[] = [
    { id: "general", label: "General" },
    { id: "recruiter", label: "Recruiter" },
    { id: "career", label: "Career" },
  ];

  return (
    <header className="border-b border-slate-200/80 dark:border-slate-700/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {brand.name}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {brand.tagline}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <nav className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              {modes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => onModeChange(m.id)}
                  className={`px-3 sm:px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                    mode === m.id
                      ? "bg-white dark:bg-slate-700 text-brand-700 dark:text-brand-300 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </nav>
            <AtmosphereSelector
              value={atmosphere}
              onChange={onAtmosphereChange}
            />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
