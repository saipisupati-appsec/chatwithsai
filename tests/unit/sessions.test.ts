import { describe, it, expect } from "vitest";
import {
  createSession,
  incrementQuestion,
  getSession,
} from "../../src/lib/sessions";
import { LIMITS } from "../../src/lib/security/limits";

describe("recruiter sessions", () => {
  it("creates a session with 0 questions", () => {
    const s = createSession();
    expect(s.questionCount).toBe(0);
    expect(getSession(s.id)?.id).toBe(s.id);
  });

  it("allows 10 follow-ups then rejects", () => {
    const s = createSession();
    for (let i = 0; i < LIMITS.RECRUITER_MAX_FOLLOWUPS; i++) {
      const r = incrementQuestion(s.id);
      expect(r.ok).toBe(true);
    }
    const blocked = incrementQuestion(s.id);
    expect(blocked.ok).toBe(false);
    expect(blocked.error).toBe(
      "You've reached the 10-question limit for this job analysis."
    );
  });
});
