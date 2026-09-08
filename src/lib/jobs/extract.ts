/**
 * Extract and normalize job description from HTML or pasted text.
 * Treats all external content as untrusted DATA only.
 */

import type { JobRequirements } from "@/lib/matching";

/** Strip scripts, styles, nav-like noise and return visible text. */
export function htmlToText(html: string): string {
  let text = html
    // remove script/style/noscript
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    // remove common chrome
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
    .replace(/<header[\s\S]*?<\/header>/gi, " ")
    .replace(/<footer[\s\S]*?<\/footer>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    // tags → space
    .replace(/<[^>]+>/g, " ")
    // entities
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    // collapse whitespace
    .replace(/\s+/g, " ")
    .trim();

  return text;
}

/** Very lightweight keyword extraction for required/preferred skills. */
const SKILL_KEYWORDS = [
  "application security",
  "product security",
  "threat modelling",
  "threat modeling",
  "stride",
  "secure sdlc",
  "secure code review",
  "sast",
  "dast",
  "sca",
  "owasp",
  "aws",
  "azure",
  "gcp",
  "kubernetes",
  "k8s",
  "docker",
  "terraform",
  "github actions",
  "ci/cd",
  "devsecops",
  "wiz",
  "checkmarx",
  "fortify",
  "burp",
  "jfrog",
  "python",
  "java",
  "javascript",
  "typescript",
  "go",
  "golang",
  "c#",
  ".net",
  "ruby",
  "bash",
  "iam",
  "waf",
  "iso 27001",
  "mitre",
  "prompt injection",
  "llm security",
  "ai security",
];

function findSkills(text: string): string[] {
  const lower = text.toLowerCase();
  const found: string[] = [];
  for (const skill of SKILL_KEYWORDS) {
    if (lower.includes(skill)) {
      // normalize display form
      const display =
        skill === "k8s"
          ? "Kubernetes"
          : skill === "golang"
          ? "Go"
          : skill
              .split(" ")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ");
      if (!found.includes(display)) found.push(display);
    }
  }
  return found;
}

/**
 * Normalize pasted JD or extracted text into JobRequirements.
 * Does not call an LLM.
 */
export function normalizeJobDescription(
  text: string,
  meta?: { title?: string; company?: string; sourceUrl?: string }
): JobRequirements {
  const skills = findSkills(text);

  // Heuristic: first half of skills treated as required, rest preferred
  const mid = Math.ceil(skills.length * 0.7);
  const requiredSkills = skills.slice(0, mid);
  const preferredSkills = skills.slice(mid);

  // Simple experience signals
  const experienceRequirements: string[] = [];
  const expMatch = text.match(/(\d+)\+?\s*years?/i);
  if (expMatch) {
    experienceRequirements.push(`${expMatch[1]}+ years experience`);
  }

  return {
    title: meta?.title || "",
    company: meta?.company || "",
    requiredSkills,
    preferredSkills,
    experienceRequirements,
    responsibilities: [],
    educationRequirements: [],
    certifications: [],
  };
}

export function extractFromHtml(
  html: string,
  sourceUrl?: string
): { text: string; requirements: JobRequirements } {
  const text = htmlToText(html);
  // Cap text used for matching to avoid huge payloads
  const capped = text.slice(0, 50_000);
  const requirements = normalizeJobDescription(capped, { sourceUrl });
  return { text: capped, requirements };
}
