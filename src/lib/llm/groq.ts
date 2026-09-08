import type { LlmProvider, LlmRequest, LlmResponse } from "./types";
import { LIMITS } from "@/lib/security/limits";

export function createGroqProvider(): LlmProvider | null {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  return {
    name: "groq",
    async complete(req: LlmRequest): Promise<LlmResponse> {
      try {
        const res = await fetch(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "llama-3.1-8b-instant",
              messages: req.messages,
              max_tokens: Math.min(
                req.maxTokens ?? LIMITS.MAX_LLM_OUTPUT_TOKENS,
                LIMITS.MAX_LLM_OUTPUT_TOKENS
              ),
              temperature: req.temperature ?? 0.2,
            }),
          }
        );

        if (!res.ok) {
          return {
            ok: false,
            provider: "groq",
            error: `Groq HTTP ${res.status}`,
          };
        }

        const data = await res.json();
        const content = data?.choices?.[0]?.message?.content;
        if (!content) {
          return { ok: false, provider: "groq", error: "Empty Groq response" };
        }

        return {
          ok: true,
          content,
          provider: "groq",
          usage: {
            inputTokens: data?.usage?.prompt_tokens,
            outputTokens: data?.usage?.completion_tokens,
          },
        };
      } catch {
        return { ok: false, provider: "groq", error: "Groq request failed" };
      }
    },
  };
}
