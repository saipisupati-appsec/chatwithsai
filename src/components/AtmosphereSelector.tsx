"use client";

import { useEffect, useState } from "react";
import {
  AtmosphereId,
  ATMOSPHERE_STORAGE_KEY,
  atmospheres,
  resolveAtmosphere,
} from "@/config/themes";

const OPTIONS: AtmosphereId[] = [
  "auto",
  "spring",
  "summer",
  "autumn",
  "winter",
  "rainy",
  "night",
];

function loadStoredAtmosphere(): AtmosphereId {
  if (typeof window === "undefined") return "auto";
  const stored = localStorage.getItem(ATMOSPHERE_STORAGE_KEY);
  if (stored && OPTIONS.includes(stored as AtmosphereId)) {
    return stored as AtmosphereId;
  }
  return "auto";
}

function saveAtmosphere(id: AtmosphereId) {
  localStorage.setItem(ATMOSPHERE_STORAGE_KEY, id);
}

/** Returns the CSS class to apply on the page shell. */
export function atmosphereClassName(selection: AtmosphereId): string {
  const resolved = resolveAtmosphere(selection);
  return atmospheres[resolved]?.className || "";
}

interface AtmosphereSelectorProps {
  value: AtmosphereId;
  onChange: (id: AtmosphereId) => void;
}

export default function AtmosphereSelector({
  value,
  onChange,
}: AtmosphereSelectorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <span className="inline-block w-[7.5rem] h-8" aria-hidden />
    );
  }

  return (
    <label className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
      <span className="sr-only">Atmosphere</span>
      <select
        value={value}
        onChange={(e) => {
          const next = e.target.value as AtmosphereId;
          saveAtmosphere(next);
          onChange(next);
        }}
        className="rounded-md border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs py-1.5 pl-2 pr-6 focus:outline-none focus:ring-2 focus:ring-brand-500"
        aria-label="Atmosphere theme"
        title="Atmosphere"
      >
        {OPTIONS.map((id) => (
          <option key={id} value={id}>
            {atmospheres[id].label}
          </option>
        ))}
      </select>
    </label>
  );
}

export { loadStoredAtmosphere, saveAtmosphere };
