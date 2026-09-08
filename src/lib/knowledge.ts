/**
 * Deterministic knowledge access layer for ChatWithSai.
 * Source of truth is the structured profile (knowledge version 1.0.0).
 * Never invent or infer unverified skills.
 */

export const KNOWLEDGE_VERSION = "1.0.0";
export const MATCHING_ALGORITHM_VERSION = "1.0.0";

export type KnowledgeStatus = "VERIFIED" | "PARTIAL" | "UNKNOWN" | "NO";

export interface SkillCheckResult {
  status: KnowledgeStatus;
  skill: string;
  message: string;
  related?: string[];
}

/** Flat list of all verified skills (normalized for lookup). */
const VERIFIED_SKILLS: Record<string, string[]> = {
  // Application Security
  "application security": ["Application Security"],
  "secure sdlc": ["Secure SDLC"],
  "secure-by-design": ["Secure-by-Design"],
  "secure by design": ["Secure-by-Design"],
  "threat modelling": ["Threat Modelling", "STRIDE"],
  "threat modeling": ["Threat Modelling", "STRIDE"],
  stride: ["STRIDE", "Threat Modelling"],
  "secure design reviews": ["Secure Design Reviews"],
  "secure code reviews": ["Secure Code Reviews"],
  "secure code review": ["Secure Code Reviews"],
  "owasp top 10": ["OWASP Top 10"],
  owasp: ["OWASP", "OWASP Top 10"],
  "vulnerability management": ["Vulnerability Management"],
  "risk assessment": ["Risk Assessment"],
  "security champion": ["Security Champion Program"],
  // Security Testing
  sast: ["SAST", "Checkmarx", "Fortify", "GitHub Advanced Security"],
  dast: ["DAST"],
  sca: ["SCA", "JFrog Xray"],
  "secrets scanning": ["Secrets Scanning"],
  "web security": ["Web Security Testing"],
  "api security": ["API Security Testing"],
  "penetration testing": ["Manual Penetration Testing"],
  // Cloud / DevSecOps
  "github actions": ["GitHub Actions"],
  "github advanced security": ["GitHub Advanced Security", "GHAS"],
  ghas: ["GitHub Advanced Security", "GHAS"],
  "github checks": ["GitHub Checks"],
  "wiz ci": ["Wiz CI"],
  "security gates": ["Security Gates"],
  aws: ["AWS"],
  azure: ["Azure"],
  waf: ["WAF"],
  iam: ["IAM"],
  // AI / LLM
  "ai/llm security": ["AI/LLM Security"],
  "ai security": ["AI/LLM Security"],
  "llm security": ["AI/LLM Security"],
  "prompt injection": ["Prompt Injection"],
  // Tools
  wiz: ["Wiz", "Wiz CI", "Wiz Sensor"],
  "wiz sensor": ["Wiz Sensor"],
  checkmarx: ["Checkmarx", "Checkmarx Dev Assist"],
  "checkmarx dev assist": ["Checkmarx Dev Assist"],
  fortify: ["Fortify"],
  nullify: ["Nullify"],
  "burp suite": ["Burp Suite"],
  burp: ["Burp Suite"],
  "jfrog xray": ["JFrog Xray"],
  "jfrog artifactory": ["JFrog Artifactory"],
  jfrog: ["JFrog Artifactory", "JFrog Xray"],
  // Programming
  "c#": ["C#"],
  csharp: ["C#"],
  "asp.net": ["ASP.NET"],
  ".net": [".NET"],
  python: ["Python"],
  java: ["Java"],
  javascript: ["JavaScript"],
  bash: ["Bash"],
  sql: ["SQL"],
  // Standards
  "mitre att&ck": ["MITRE ATT&CK"],
  "iso 27001": ["ISO 27001"],
  agile: ["Agile"],
  scrum: ["Scrum"],
};

/** Explicitly unknown / unverified technologies. */
const UNKNOWN_SKILLS = new Set([
  "kubernetes",
  "k8s",
  "eks",
  "aks",
  "gke",
  "go",
  "golang",
  "ruby",
  "typescript",
  "ts",
]);

function normalize(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, " ");
}

/**
 * Check whether a skill is verified, unknown, or not present.
 * Never converts UNKNOWN → YES.
 */
export function checkSkill(skillQuery: string): SkillCheckResult {
  const q = normalize(skillQuery);

  // Exact / known unknown
  for (const unknown of UNKNOWN_SKILLS) {
    if (q === unknown || q.includes(unknown)) {
      return {
        status: "UNKNOWN",
        skill: skillQuery,
        message: `${skillQuery} experience is not currently verified in Sai's authoritative profile.`,
      };
    }
  }

  // Verified lookup
  for (const [key, labels] of Object.entries(VERIFIED_SKILLS)) {
    if (q === key || q.includes(key) || key.includes(q)) {
      return {
        status: "VERIFIED",
        skill: skillQuery,
        message: `Sai has verified experience with ${labels[0]}.`,
        related: labels,
      };
    }
  }

  return {
    status: "UNKNOWN",
    skill: skillQuery,
    message: `No verified information about "${skillQuery}" is present in Sai's authoritative profile.`,
  };
}

export function getAllVerifiedSkills(): string[] {
  const set = new Set<string>();
  for (const labels of Object.values(VERIFIED_SKILLS)) {
    labels.forEach((l) => set.add(l));
  }
  return Array.from(set).sort();
}

export function getUnknownSkills(): string[] {
  return [
    "Kubernetes",
    "EKS",
    "AKS",
    "GKE",
    "Go",
    "Golang",
    "Ruby",
    "TypeScript",
  ];
}

export const PROFILE_SUMMARY = `Balasubramanya Sai Kumar is an Application Security Engineer with 8+ years of combined software engineering and security experience. His security experience includes Application Security, Secure SDLC, DevSecOps, Cloud Security, Threat Modelling, Secure Code Reviews, SAST, DAST, SCA, Vulnerability Management, Risk Assessment, and Security Automation.

He has experience integrating security controls into CI/CD using GitHub Advanced Security, Wiz CI, GitHub Checks, and Security Gates. He has experience with AWS cloud security and AI/LLM security initiatives.

Important distinction:
• Software development experience: March 2018 – April 2020
• Security-focused experience: April 2020 – Present`;
