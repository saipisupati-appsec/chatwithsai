/**
 * Deterministic job matching engine (V1).
 * Score is calculated without an LLM.
 */

import { checkSkill, KNOWLEDGE_VERSION, MATCHING_ALGORITHM_VERSION } from "./knowledge";

export interface JobRequirements {
  title?: string;
  company?: string;
  requiredSkills: string[];
  preferredSkills: string[];
  experienceRequirements: string[];
  responsibilities: string[];
  educationRequirements: string[];
  certifications: string[];
  location?: string;
  employmentType?: string;
}

export interface MatchDetail {
  item: string;
  status: "match" | "partial" | "gap" | "unknown";
  note?: string;
}

export interface MatchResult {
  score: number;
  band: "Strong Match" | "Good Match" | "Moderate Match" | "Limited Match";
  strongMatches: MatchDetail[];
  partialMatches: MatchDetail[];
  gaps: MatchDetail[];
  unknowns: MatchDetail[];
  recommendation: string;
  knowledgeVersion: string;
  algorithmVersion: string;
}

const WEIGHTS = {
  requiredSkills: 0.4,
  experience: 0.2,
  responsibilities: 0.2,
  preferredSkills: 0.1,
  education: 0.1,
};

function scoreItems(
  items: string[],
  weight: number
): { points: number; max: number; details: MatchDetail[] } {
  if (items.length === 0) {
    return { points: weight, max: weight, details: [] }; // no requirements → full points
  }

  let matched = 0;
  const details: MatchDetail[] = [];

  for (const item of items) {
    const result = checkSkill(item);
    if (result.status === "VERIFIED") {
      matched += 1;
      details.push({ item, status: "match", note: result.message });
    } else if (result.status === "PARTIAL") {
      matched += 0.5;
      details.push({ item, status: "partial", note: result.message });
    } else if (result.status === "UNKNOWN") {
      details.push({ item, status: "unknown", note: result.message });
    } else {
      details.push({ item, status: "gap", note: result.message });
    }
  }

  const ratio = matched / items.length;
  return {
    points: ratio * weight,
    max: weight,
    details,
  };
}

export function calculateMatch(job: JobRequirements): MatchResult {
  const required = scoreItems(job.requiredSkills, WEIGHTS.requiredSkills);
  const preferred = scoreItems(job.preferredSkills, WEIGHTS.preferredSkills);
  const experience = scoreItems(job.experienceRequirements, WEIGHTS.experience);
  const responsibilities = scoreItems(
    job.responsibilities,
    WEIGHTS.responsibilities
  );
  const education = scoreItems(job.educationRequirements, WEIGHTS.education);

  const total =
    required.points +
    preferred.points +
    experience.points +
    responsibilities.points +
    education.points;

  const score = Math.round(Math.min(100, Math.max(0, total * 100)));

  let band: MatchResult["band"];
  if (score >= 85) band = "Strong Match";
  else if (score >= 70) band = "Good Match";
  else if (score >= 50) band = "Moderate Match";
  else band = "Limited Match";

  const allDetails = [
    ...required.details,
    ...preferred.details,
    ...experience.details,
    ...responsibilities.details,
    ...education.details,
  ];

  const strongMatches = allDetails.filter((d) => d.status === "match");
  const partialMatches = allDetails.filter((d) => d.status === "partial");
  const gaps = allDetails.filter((d) => d.status === "gap");
  const unknowns = allDetails.filter((d) => d.status === "unknown");

  let recommendation: string;
  if (score >= 85) {
    recommendation =
      "Strong match. Sai's verified Application Security, DevSecOps and tooling experience aligns well with the core requirements.";
  } else if (score >= 70) {
    recommendation =
      "Good match. Sai covers most core requirements. Review the listed gaps/unknowns before deciding.";
  } else if (score >= 50) {
    recommendation =
      "Moderate match. Several requirements are only partially covered or unverified. Consider whether the gaps are critical for the role.";
  } else {
    recommendation =
      "Limited match based on currently verified profile data. Significant gaps or unknowns exist relative to the stated requirements.";
  }

  return {
    score,
    band,
    strongMatches,
    partialMatches,
    gaps,
    unknowns,
    recommendation,
    knowledgeVersion: KNOWLEDGE_VERSION,
    algorithmVersion: MATCHING_ALGORITHM_VERSION,
  };
}

/** Format a match result for chat display. */
export function formatMatchResult(result: MatchResult): string {
  const lines: string[] = [
    `**Match: ${result.score}% — ${result.band}**`,
    "",
  ];

  if (result.strongMatches.length > 0) {
    lines.push("**Strong matches**");
    result.strongMatches.forEach((m) => lines.push(`• ${m.item}`));
    lines.push("");
  }

  if (result.partialMatches.length > 0) {
    lines.push("**Partial matches**");
    result.partialMatches.forEach((m) => lines.push(`• ${m.item}`));
    lines.push("");
  }

  if (result.gaps.length > 0) {
    lines.push("**Gaps**");
    result.gaps.forEach((m) => lines.push(`• ${m.item}`));
    lines.push("");
  }

  if (result.unknowns.length > 0) {
    lines.push("**Unknown / not verified in profile**");
    result.unknowns.forEach((m) => lines.push(`• ${m.item}`));
    lines.push("");
  }

  lines.push(`**Recommendation**  \n${result.recommendation}`);
  lines.push("");
  lines.push(
    `_Knowledge v${result.knowledgeVersion} · Matching algorithm v${result.algorithmVersion}_`
  );

  return lines.join("\n");
}
