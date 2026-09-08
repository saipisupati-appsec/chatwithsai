export interface LlmMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LlmRequest {
  messages: LlmMessage[];
  maxTokens?: number;
  temperature?: number;
}

export interface LlmResponse {
  ok: boolean;
  content?: string;
  provider?: "groq" | "openrouter" | "deterministic";
  error?: string;
  usage?: { inputTokens?: number; outputTokens?: number };
}

export interface LlmProvider {
  name: "groq" | "openrouter";
  complete(req: LlmRequest): Promise<LlmResponse>;
}
