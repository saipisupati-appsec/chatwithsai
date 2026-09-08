/**
 * Job analysis cache.
 * Key = SHA256(normalizedJD + knowledgeVersion + algorithmVersion)
 * In-memory for V1; swap to Supabase when credentials exist.
 */

import type { MatchResult } from "./matching";
import type { JobRequirements } from "./matching";

interface CacheEntry {
  requirements: JobRequirements;
  match: MatchResult;
  createdAt: number;
}

const store = new Map<string, CacheEntry>();
const TTL_MS = 24 * 60 * 60 * 1000;

export function getCachedAnalysis(hash: string): CacheEntry | null {
  const e = store.get(hash);
  if (!e) return null;
  if (Date.now() - e.createdAt > TTL_MS) {
    store.delete(hash);
    return null;
  }
  return e;
}

export function setCachedAnalysis(
  hash: string,
  requirements: JobRequirements,
  match: MatchResult
): void {
  store.set(hash, { requirements, match, createdAt: Date.now() });
}
