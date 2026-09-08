import { NextRequest, NextResponse } from "next/server";
import { LIMITS, assertQuestionLength } from "@/lib/security/limits";
import type { Mode } from "@/lib/types";
import { getSession, incrementQuestion } from "@/lib/sessions";
import { answerQuestion, type TopicId } from "@/lib/answers";

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

    const { message, mode, sessionId, lastTopic } = body as {
      message?: string;
      mode?: string;
      sessionId?: string;
      lastTopic?: TopicId;
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

    let matchResult = null;
    let questionsRemaining: number | undefined;
    let activeSessionId = sessionId;

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
      matchResult = session.matchResult ?? null;
      questionsRemaining =
        LIMITS.RECRUITER_MAX_FOLLOWUPS - session.questionCount;
      activeSessionId = session.id;
    } else if (resolvedMode === "recruiter" && sessionId) {
      const s = getSession(sessionId);
      matchResult = s?.matchResult ?? null;
    }

    const result = answerQuestion(message, {
      mode: resolvedMode,
      lastTopic: lastTopic ?? null,
      matchResult,
      questionsUsed:
        questionsRemaining !== undefined
          ? LIMITS.RECRUITER_MAX_FOLLOWUPS - questionsRemaining
          : undefined,
      questionsMax: LIMITS.RECRUITER_MAX_FOLLOWUPS,
    });

    return NextResponse.json({
      reply: result.text,
      topic: result.topic,
      mode: resolvedMode,
      sessionId: activeSessionId,
      questionsRemaining,
      source: "deterministic",
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to process chat request." },
      { status: 500 }
    );
  }
}
