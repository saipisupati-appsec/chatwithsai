import { NextRequest, NextResponse } from "next/server";
import { LIMITS, assertQuestionLength } from "@/lib/security/limits";
import { fetchJobPage } from "@/lib/jobs/fetch";
import { extractFromHtml, normalizeJobDescription } from "@/lib/jobs/extract";
import { calculateMatch, formatMatchResult } from "@/lib/matching";
import { createSession } from "@/lib/sessions";
import { createHash } from "crypto";
import { KNOWLEDGE_VERSION, MATCHING_ALGORITHM_VERSION } from "@/lib/knowledge";

export const runtime = "nodejs";

function hashJd(text: string): string {
  return createHash("sha256")
    .update(text + KNOWLEDGE_VERSION + MATCHING_ALGORITHM_VERSION)
    .digest("hex");
}

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

    const { jobUrl, jobDescription } = body as {
      jobUrl?: string;
      jobDescription?: string;
    };

    let requirements;
    let sourceUrl: string | undefined;
    let normalizedText = "";

    if (jobUrl && typeof jobUrl === "string") {
      const fetched = await fetchJobPage(jobUrl);
      if (!fetched.ok || !fetched.html) {
        return NextResponse.json(
          {
            error:
              fetched.error ||
              "I couldn't safely retrieve that job page. Please paste the job description instead.",
            allowPaste: true,
          },
          { status: 422 }
        );
      }
      const extracted = extractFromHtml(fetched.html, fetched.finalUrl);
      requirements = extracted.requirements;
      normalizedText = extracted.text;
      sourceUrl = fetched.finalUrl;
    } else if (jobDescription && typeof jobDescription === "string") {
      const lenError = assertQuestionLength(jobDescription);
      // Allow longer JD paste than normal questions
      if (jobDescription.length > 50_000) {
        return NextResponse.json(
          { error: "Job description is too long." },
          { status: 400 }
        );
      }
      if (lenError && jobDescription.length > LIMITS.MAX_QUESTION_LENGTH * 10) {
        return NextResponse.json({ error: lenError }, { status: 400 });
      }
      normalizedText = jobDescription.slice(0, 50_000);
      requirements = normalizeJobDescription(normalizedText);
    } else {
      return NextResponse.json(
        { error: "Provide either jobUrl or jobDescription." },
        { status: 400 }
      );
    }

    const matchResult = calculateMatch(requirements);
    const jdHash = hashJd(normalizedText);

    const session = createSession({
      jobRequirements: requirements,
      matchResult,
      normalizedJdHash: jdHash,
      sourceUrl,
    });

    return NextResponse.json({
      sessionId: session.id,
      match: matchResult,
      formatted: formatMatchResult(matchResult),
      questionsRemaining: LIMITS.RECRUITER_MAX_FOLLOWUPS,
      knowledgeVersion: KNOWLEDGE_VERSION,
      algorithmVersion: MATCHING_ALGORITHM_VERSION,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to analyze job at this time." },
      { status: 500 }
    );
  }
}
