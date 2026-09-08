/**
 * Configurable hard limits for ChatWithSai.
 * Core principle: hard-limited everywhere.
 */

export const LIMITS = {
  MAX_QUESTION_LENGTH: Number(process.env.MAX_QUESTION_LENGTH) || 2000,
  MAX_URL_LENGTH: Number(process.env.MAX_URL_LENGTH) || 2000,
  MAX_REQUEST_BODY: Number(process.env.MAX_REQUEST_BODY) || 20 * 1024, // 20 KB
  MAX_JOB_PAGE_SIZE: Number(process.env.MAX_JOB_PAGE_SIZE) || 5 * 1024 * 1024,
  MAX_REDIRECTS: Number(process.env.MAX_REDIRECTS) || 3,
  MAX_LLM_INPUT_TOKENS: Number(process.env.MAX_LLM_INPUT_TOKENS) || 3000,
  MAX_LLM_OUTPUT_TOKENS: Number(process.env.MAX_LLM_OUTPUT_TOKENS) || 500,
  RECRUITER_MAX_FOLLOWUPS: 10,
} as const;

export function assertQuestionLength(text: string): string | null {
  if (!text || typeof text !== "string") return "Question is required.";
  if (text.length > LIMITS.MAX_QUESTION_LENGTH) {
    return `Question exceeds maximum length of ${LIMITS.MAX_QUESTION_LENGTH} characters.`;
  }
  return null;
}
