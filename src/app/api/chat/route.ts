import { NextRequest, NextResponse } from "next/server";
import { LIMITS, assertQuestionLength } from "@/lib/security/limits";
import { getMockResponse } from "@/lib/mock-responses";
import type { Mode } from "@/lib/types";
import { getSession, incrementQuestion } from "@/lib/sessions";
import { formatMatchResult } from "@/lib/matching";
import { checkSkill } from "@/lib/knowledge";

export const runtime = "nodejs";

const VALID_MODES: Mode[] = ["general", "recruiter", "career"];

export async function POST(req: NextRequest) {
  try {
    const contentLength = Number(req.headers.get("content-length") || 0);
    if (contentLength > LIMITS.MAX_REQUEST_BODY) {
      return NextResponse.json(
        { error: "Request body too large." },
        { status: 413 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const { message, mode, sessionId } = body as {
      message?: string;
      mode?: string;
      sessionId?: string;
    };

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "message is required." }, { status: 400 });
    }

    const lengthError = assertQuestionLength(message);
    if (lengthError) {
      return NextResponse.json({ error: lengthError }, { status: 400 });
    }

    const resolvedMode: Mode = VALID_MODES.includes(mode as Mode)
      ? (mode as Mode)
      : "general";

    // Recruiter follow-up with session → enforce 10-question limit server-side
    if (resolvedMode === "recruiter" && sessionId) {
      const inc = incrementQuestion(sessionId);
      if (!inc.ok) {
        return NextResponse.json(
          {
            error:
              inc.error ||
              "You've reached the 10-question limit for this job analysis.",
            questionsRemaining: 0,
          },
          { status: 429 }
        );
      }

      const session = inc.session!;
      const remaining =
        LIMITS.RECRUITER_MAX_FOLLOWUPS - session.questionCount;

      // Prefer answering from stored analysis when possible
      const q = message.toLowerCase();
      if (
        session.matchResult &&
        (q.includes("match") ||
          q.includes("score") ||
          q.includes("gap") ||
          q.includes("strength") ||
          q.includes("recommend"))
      ) {
        return NextResponse.json({
          reply: formatMatchResult(session.matchResult),
          mode: resolvedMode,
          sessionId: session.id,
          questionsRemaining: remaining,
          source: "deterministic-session",
        });
      }

      // Skill check against profile
      const skillHit = checkSkill(message);
      if (skillHit.status !== "UNKNOWN" || /kubernetes|golang|\bgo\b|ruby|typescript/i.test(message)) {
        return NextResponse.json({
          reply:
            skillHit.status === "VERIFIED"
              ? skillHit.message +
                (skillHit.related
                  ? ` Related: ${skillHit.related.join(", ")}.`
                  : "")
              : `**Unknown / Gap** — ${skillHit.message}`,
          mode: resolvedMode,
          sessionId: session.id,
          questionsRemaining: remaining,
          source: "deterministic-skill",
        });
      }

      const reply = getMockResponse(message, resolvedMode);
      return NextResponse.json({
        reply,
        mode: resolvedMode,
        sessionId: session.id,
        questionsRemaining: remaining,
        source: "deterministic",
      });
    }

    // General / Career / Recruiter without session
    const reply = getMockResponse(message, resolvedMode);
    return NextResponse.json({
      reply,
      mode: resolvedMode,
      source: "deterministic",
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to process chat request." },
      { status: 500 }
    );
  }
}
