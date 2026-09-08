/**
 * Compatibility layer — prefer src/lib/answers.ts for new code.
 */
import { Mode } from "./types";
import { answerQuestion, dynamicSuggestions } from "./answers";

export function getMockResponse(question: string, mode: Mode): string {
  return answerQuestion(question, { mode }).text;
}

export const SUGGESTED_QUESTIONS: Record<Mode, string[]> = {
  general: dynamicSuggestions("general"),
  recruiter: dynamicSuggestions("recruiter", null, false),
  career: dynamicSuggestions("career"),
};
