/**
 * RAG over Sai knowledge base.
 * V1: deterministic keyword retrieval from structured knowledge.
 * Full pgvector retrieval activates when Supabase + embeddings are configured.
 */

import { PROFILE_SUMMARY, checkSkill, getAllVerifiedSkills } from "./knowledge";

export interface RagChunk {
  source: string;
  content: string;
  category: string;
}

export function retrieveRelevantChunks(question: string): RagChunk[] {
  const q = question.toLowerCase();
  const chunks: RagChunk[] = [];

  if (/who is|about sai|introduce|summary|profile/.test(q)) {
    chunks.push({
      source: "profile/about-sai",
      category: "profile",
      content: PROFILE_SUMMARY,
    });
  }

  const skill = checkSkill(question);
  if (skill.status === "VERIFIED" && skill.related) {
    chunks.push({
      source: "skills/technical-skills",
      category: "skills",
      content: `Verified: ${skill.related.join(", ")}. ${skill.message}`,
    });
  }

  if (/skill|tools|technolog/.test(q)) {
    chunks.push({
      source: "skills/technical-skills",
      category: "skills",
      content: `Verified skills include: ${getAllVerifiedSkills()
        .slice(0, 30)
        .join(", ")}.`,
    });
  }

  return chunks;
}

export function isVectorRagAvailable(): boolean {
  return Boolean(
    process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}
