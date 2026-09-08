import { NextResponse } from "next/server";
import { KNOWLEDGE_VERSION, MATCHING_ALGORITHM_VERSION } from "@/lib/knowledge";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "ChatWithSai",
    knowledgeVersion: KNOWLEDGE_VERSION,
    matchingAlgorithmVersion: MATCHING_ALGORITHM_VERSION,
    timestamp: new Date().toISOString(),
  });
}
