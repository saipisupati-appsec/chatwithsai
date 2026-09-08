/**
 * Server-side recruiter session store.
 * In-memory for V1 bootstrap. Replace with Supabase when credentials are available.
 * NEVER trust client-supplied question counts.
 */

import { LIMITS } from "@/lib/security/limits";
import type { MatchResult } from "@/lib/matching";
import type { JobRequirements } from "@/lib/matching";
import { randomUUID } from "crypto";

export interface RecruiterSession {
  id: string;
  createdAt: number;
  expiresAt: number;
  questionCount: number;
  jobRequirements?: JobRequirements;
  matchResult?: MatchResult;
  normalizedJdHash?: string;
  sourceUrl?: string;
}

const SESSION_TTL_MS = 60 * 60 * 1000; // 1 hour
const store = new Map<string, RecruiterSession>();

function purgeExpired() {
  const now = Date.now();
  for (const [id, s] of store) {
    if (s.expiresAt < now) store.delete(id);
  }
}

export function createSession(partial?: {
  jobRequirements?: JobRequirements;
  matchResult?: MatchResult;
  normalizedJdHash?: string;
  sourceUrl?: string;
}): RecruiterSession {
  purgeExpired();
  const id = randomUUID();
  const now = Date.now();
  const session: RecruiterSession = {
    id,
    createdAt: now,
    expiresAt: now + SESSION_TTL_MS,
    questionCount: 0,
    ...partial,
  };
  store.set(id, session);
  return session;
}

export function getSession(id: string): RecruiterSession | null {
  purgeExpired();
  const s = store.get(id);
  if (!s) return null;
  if (s.expiresAt < Date.now()) {
    store.delete(id);
    return null;
  }
  return s;
}

export function incrementQuestion(id: string): {
  ok: boolean;
  session?: RecruiterSession;
  error?: string;
} {
  const s = getSession(id);
  if (!s) return { ok: false, error: "Session not found or expired." };

  if (s.questionCount >= LIMITS.RECRUITER_MAX_FOLLOWUPS) {
    return {
      ok: false,
      session: s,
      error: "You've reached the 10-question limit for this job analysis.",
    };
  }

  s.questionCount += 1;
  store.set(id, s);
  return { ok: true, session: s };
}

export function updateSession(
  id: string,
  patch: Partial<RecruiterSession>
): RecruiterSession | null {
  const s = getSession(id);
  if (!s) return null;
  const updated = { ...s, ...patch, id: s.id };
  store.set(id, updated);
  return updated;
}
