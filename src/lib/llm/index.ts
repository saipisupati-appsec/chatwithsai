/**
 * LLM gateway: Groq → OpenRouter → deterministic fallback.
 * Never auto-uses paid providers. Never invents Sai facts.
 */

import type { LlmRequest, LlmResponse } from "./types";
import { createGroqProvider } from "./groq";
import { createOpenRouterProvider } from "./openrouter";

const SYSTEM_GROUNDING = `You are ChatWithSai, a professional assistant focused only on Balasubramanya Sai Kumar's verified professional profile, skills, experience, and job fit.
Rules:
- Only use facts provided in the context.
- Never invent employers, skills, years, or projects.
- If something is not in the context, say it is unknown / not verified.
- Do not answer general knowledge, coding, weather, or company research questions.
- Keep answers concise and professional.`;

export async function completeWithFallback(
  userMessages: LlmRequest["messages"],
  options?: { maxTokens?: number }
): Promise<LlmResponse> {
  const messages = [
    { role: "system" as const, content: SYSTEM_GROUNDING },
    ...userMessages,
  ];

  const req: LlmRequest = {
    messages,
    maxTokens: options?.maxTokens,
    temperature: 0.2,
  };

  const groq = createGroqProvider();
  if (groq) {
    const r = await groq.complete(req);
    if (r.ok) return r;
  }

  const openrouter = createOpenRouterProvider();
  if (openrouter) {
    const r = await openrouter.complete(req);
    if (r.ok) return r;
  }

  return {
    ok: false,
    provider: "deterministic",
    error:
      "AI reasoning is temporarily unavailable. Deterministic job matching and profile answers remain available.",
  };
}
