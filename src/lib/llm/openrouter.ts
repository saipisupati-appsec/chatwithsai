import type { LlmProvider, LlmRequest, LlmResponse } from "./types";
import { LIMITS } from "@/lib/security/limits";

export function createOpenRouterProvider(): LlmProvider | null {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  return {
    name: "openrouter",
    async complete(req: LlmRequest): Promise<LlmResponse> {
      try {
        const res = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
              "HTTP-Referer":
                process.env.NEXT_PUBLIC_APP_URL || "http://localhost:4567",
              "X-Title": "ChatWithSai",
            },
            body: JSON.stringify({
              model: "meta-llama/llama-3.1-8b-instruct:free",
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
            provider: "openrouter",
            error: `OpenRouter HTTP ${res.status}`,
          };
        }

        const data = await res.json();
        const content = data?.choices?.[0]?.message?.content;
        if (!content) {
          return {
            ok: false,
            provider: "openrouter",
            error: "Empty OpenRouter response",
          };
        }

        return {
          ok: true,
          content,
          provider: "openrouter",
          usage: {
            inputTokens: data?.usage?.prompt_tokens,
            outputTokens: data?.usage?.completion_tokens,
          },
        };
      } catch {
        return {
          ok: false,
          provider: "openrouter",
          error: "OpenRouter request failed",
        };
      }
    },
  };
}
