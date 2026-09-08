/**
 * Conversational, knowledge-first answer engine.
 * Topic map + optional session context — not a wall of if (question === ...).
 */

import { Mode } from "./types";
import { brand } from "@/config/brand";
import type { MatchResult } from "./matching";
import { formatMatchResult } from "./matching";

export type TopicId =
  | "profile"
  | "specialize"
  | "experience_years"
  | "dazn"
  | "career_history"
  | "threat_modelling"
  | "sast"
  | "sca"
  | "aws"
  | "wiz"
  | "jfrog"
  | "checkmarx"
  | "programming"
  | "projects"
  | "skills_overview"
  | "education"
  | "achievements"
  | "hobbies"
  | "cricket"
  | "kubernetes"
  | "go"
  | "singing"
  | "greeting"
  | "out_of_scope"
  | "unknown"
  | "recruiter_why"
  | "recruiter_interview"
  | "recruiter_gaps"
  | "recruiter_strengths"
  | "recruiter_match";

interface TopicDef {
  id: TopicId;
  patterns: RegExp[];
  answer: string;
}

const TOPICS: TopicDef[] = [
  {
    id: "greeting",
    patterns: [/^(hi|hello|hey|good (morning|afternoon|evening))\b/i],
    answer: `Hello — happy to help you learn about Sai's professional background. Ask about experience, tools, projects, or job fit.`,
  },
  {
    id: "profile",
    patterns: [
      /who is sai/,
      /about sai/,
      /tell me about sai/,
      /introduce sai/,
      /sai'?s profile/,
    ],
    answer: `Balasubramanya Sai Kumar is an **Application Security Engineer** with **8+ years of combined software engineering and security experience**.

Core focus: Application Security, Secure SDLC, DevSecOps, Cloud Security, Threat Modelling (STRIDE), SAST/DAST/SCA, and security automation.

Important distinction:
• Software development: March 2018 – April 2020
• Security-focused work: April 2020 – Present

He currently works at **DAZN** as an Application Security Engineer.`,
  },
  {
    id: "specialize",
    patterns: [
      /speciali[sz]/,
      /expertise/,
      /what does sai do/,
      /core (areas|strengths)/,
    ],
    answer: `Sai specializes in **Application Security** and **Product Security**.

• Threat Modelling (STRIDE) & secure design reviews
• Secure code review, SAST / DAST / SCA
• DevSecOps & CI/CD security gates (GHAS, Wiz CI, GitHub Checks)
• AWS cloud security, WAF, IAM
• AI/LLM security initiatives
• Vulnerability management & Security Champion programs

Current role: Application Security Engineer at DAZN.`,
  },
  {
    id: "experience_years",
    patterns: [
      /years of experience/,
      /how (long|many years)/,
      /experience overview/,
      /tell me about sai'?s career/,
      /career journey/,
    ],
    answer: `Sai has **8+ years** of combined software engineering and security experience.

• **Development** (Mar 2018 – Apr 2020): VSoft — C#, ASP.NET, .NET
• **Security** (Apr 2020 – Present): Wells Fargo → Pole to Win → DAZN

He does **not** claim 8+ years of pure Application Security; security-focused work starts April 2020.`,
  },
  {
    id: "dazn",
    patterns: [/dazn/, /current role/, /where does sai work/, /present employer/],
    answer: `**Application Security Engineer — DAZN** (Jun 2023 – Present, Hyderabad)

• STRIDE threat modelling across 50+ applications
• Pre-merge gates (Wiz + GitHub Checks) blocking CVSS >9
• SAST/SCA/GHAS/Wiz CI in CI/CD
• AWS security, Wiz / Wiz Sensor, JFrog, Checkmarx Dev Assist
• Nullify AI-driven AppSec testing, Helix AI security
• Security Champions, HackerOne collaboration, ISO 27001 support`,
  },
  {
    id: "career_history",
    patterns: [
      /employment/, 
      /work history/, 
      /previous compan/, 
      /career history/,
      /where has sai worked/,
    ],
    answer: `**DAZN** — Application Security Engineer (Jun 2023 – Present)
**Pole to Win** — Security Engineer (Feb 2022 – May 2023)
**Wells Fargo** — Tech Operations Sr Analyst (Apr 2020 – Feb 2022)
**VSoft** — Jr. Engineer Development (Mar 2018 – Apr 2020)

Security-focused path begins at Wells Fargo (2020).`,
  },
  {
    id: "threat_modelling",
    patterns: [
      /threat model/,
      /threat modelling/,
      /threat modeling/,
      /\bstride\b/,
    ],
    answer: `Yes — Sai has solid **threat modelling** experience.

At DAZN he has run **STRIDE-based threat modelling across 50+ applications**, plus secure design reviews covering APIs, secrets, logging, sensitive data, and WAF controls.`,
  },
  {
    id: "sast",
    patterns: [/\bsast\b/, /static (application )?security/, /static analysis/],
    answer: `Yes — extensive **SAST** experience across Wells Fargo, Pole to Win, and DAZN.

Tools: **Checkmarx**, **Checkmarx Dev Assist**, **Fortify**, **GitHub Advanced Security**.
Languages covered in practice: .NET, Java, Python.
Also integrated into CI/CD with pre-merge security gates.`,
  },
  {
    id: "sca",
    patterns: [/\bsca\b/, /software composition/, /dependency scanning/, /supply.?chain/],
    answer: `Yes — Sai works with **SCA** and supply-chain security, notably **JFrog Xray** / Artifactory and pipeline-integrated scanning (including alongside GHAS and Wiz CI at DAZN).`,
  },
  {
    id: "aws",
    patterns: [/\baws\b/, /amazon web services/, /cloud security/],
    answer: `Yes — Sai has **AWS cloud security** experience at DAZN: cloud controls, **WAF**, **IAM**, and visibility via **Wiz** / Wiz Sensor. He also has Azure / Azure AD exposure.`,
  },
  {
    id: "wiz",
    patterns: [/\bwiz\b/, /wiz ci/, /wiz sensor/],
    answer: `Yes — strong **Wiz** experience at DAZN:
• **Wiz CI** in pipelines
• **Wiz Sensor** for cloud visibility
• Pre-merge gates with GitHub Checks blocking high-risk (CVSS >9) PRs`,
  },
  {
    id: "jfrog",
    patterns: [/jfrog/, /artifactory/, /\bxray\b/],
    answer: `Yes — hands-on with **JFrog Artifactory** and **JFrog Xray** at DAZN for artifact security and SCA in the supply chain.`,
  },
  {
    id: "checkmarx",
    patterns: [/checkmarx/],
    answer: `Yes — Sai has used **Checkmarx** (and Checkmarx Dev Assist) for SAST across multiple roles, including administration of Dev Assist at DAZN.`,
  },
  {
    id: "programming",
    patterns: [
      /programming language/,
      /what languages/,
      /languages does sai/,
      /\bc#\b/,
      /python/,
      /\bjava\b/,
      /javascript/,
    ],
    answer: `Verified programming experience:
**C#**, **ASP.NET**, **.NET**, **Python**, **Java**, **JavaScript**, **Bash**, **SQL**.

Used in both product development (earlier career) and security automation / SAST workflows.`,
  },
  {
    id: "projects",
    patterns: [/projects?/, /initiatives?/, /what has sai (built|worked on)/],
    answer: `Professional security initiatives (not side projects):
• Pre-merge security gates (Wiz + GitHub Checks), CVSS >9 blocks
• SAST / SCA / GHAS / Wiz CI in CI/CD
• STRIDE modelling on 50+ apps
• Helix AI / AI-LLM security support
• JFrog supply-chain hardening
• Nullify AI-driven AppSec testing
• HackerOne collaboration & ISO 27001 support`,
  },
  {
    id: "skills_overview",
    patterns: [/technical skills/, /what skills/, /security tools does/],
    answer: `**AppSec:** Secure SDLC, STRIDE, secure code review, OWASP, vuln management
**Testing:** SAST, DAST, SCA, secrets scanning, API/web testing
**DevSecOps:** GitHub Actions/GHAS/Checks, Wiz CI, security gates, AWS, Azure, WAF, IAM
**Tools:** Wiz, Checkmarx, Fortify, Nullify, Burp, JFrog Xray/Artifactory
**Languages:** C#, ASP.NET, Python, Java, JavaScript, Bash, SQL`,
  },
  {
    id: "education",
    patterns: [/education/, /degree/, /university/, /college/, /b\.?tech/],
    answer: `**B.Tech — Electronics and Communication Engineering**  
KITS, affiliated to JNTU-HYD · 2017`,
  },
  {
    id: "achievements",
    patterns: [/achievements?/, /accomplishments?/],
    answer: `• Pre-merge gates blocking CVSS >9 PRs (Wiz + GitHub Checks)
• SAST/SCA/GHAS/Wiz CI integrated into CI/CD
• STRIDE threat modelling across 50+ applications
• AI/LLM security support for Helix AI
• Cloud visibility with Wiz Sensor; supply-chain via JFrog
• Nullify AI-driven testing; HackerOne collaboration; ISO 27001 support`,
  },
  {
    id: "hobbies",
    patterns: [/hobbies/, /outside work/, /free time/, /personal interests/],
    answer: `Outside work, Sai enjoys **chess**, **cricket**, **books**, and **guitar**.`,
  },
  {
    id: "cricket",
    patterns: [/\bcricket\b/],
    answer: `Yes — **cricket** is one of Sai's hobbies, along with chess, books, and guitar.`,
  },
  {
    id: "kubernetes",
    patterns: [/kubernetes/, /\bk8s\b/, /\beks\b/, /\baks\b/, /\bgke\b/],
    answer: `Kubernetes isn't currently verified in Sai's profile. I won't turn AWS/cloud experience into Kubernetes experience just because they're often mentioned together. 😄`,
  },
  {
    id: "go",
    patterns: [/\bgolang\b/, /\bgo language\b/, /\bgo\b(?=.*experienc|\?|$)/],
    answer: `**Go** isn't listed in Sai's verified programming languages (C#, ASP.NET, Python, Java, JavaScript, Bash, SQL). Treated as unknown — not inferred from other languages.`,
  },
  {
    id: "singing",
    patterns: [/singing/, /\bsing\b/, /vocal/],
    answer: `Singing isn't listed in Sai's current profile, so I can't verify that one. I won't add imaginary skills just to improve the CV. 😄`,
  },
  {
    id: "out_of_scope",
    patterns: [
      /weather/,
      /stock price/,
      /bitcoin/,
      /who is the president/,
      /apple'?s revenue/,
      /google'?s ceo/,
      /write (me )?(a )?python/,
      /current news/,
    ],
    answer: `${brand.name} stays focused on Sai's professional experience, skills, projects, and career fit — not general Q&A.`,
  },
];

function normalize(q: string): string {
  return q.toLowerCase().trim().replace(/\s+/g, " ");
}

/** Resolve follow-ups like "what about X?" using last topic when needed. */
function expandWithContext(question: string, lastTopic?: TopicId | null): string {
  const q = normalize(question);
  if (
    lastTopic &&
    (/^(what about|and|how about|also)\b/.test(q) ||
      /^(does he|has he|what is his)\b/.test(q))
  ) {
    // Keep short follow-up as-is; topic patterns still match entities in the question.
    // If the follow-up has no entity, re-ask via last topic id handled below.
    if (q.length < 40 && !TOPICS.some((t) => t.patterns.some((p) => p.test(q)))) {
      return `${q} ${lastTopic.replace(/_/g, " ")}`;
    }
  }
  return q;
}

export function detectTopic(
  question: string,
  lastTopic?: TopicId | null
): TopicId {
  const q = expandWithContext(question, lastTopic);
  for (const t of TOPICS) {
    if (t.patterns.some((p) => p.test(q))) return t.id;
  }
  // follow-up with almost no content → reuse last topic
  if (lastTopic && /^(what about|and|how about|also|same for)\b/i.test(question)) {
    return lastTopic;
  }
  return "unknown";
}

export interface AnswerContext {
  mode: Mode;
  lastTopic?: TopicId | null;
  matchResult?: MatchResult | null;
  questionsUsed?: number;
  questionsMax?: number;
}

export interface AnswerResult {
  text: string;
  topic: TopicId;
}

function recruiterFollowUp(
  question: string,
  ctx: AnswerContext
): AnswerResult | null {
  if (ctx.mode !== "recruiter" || !ctx.matchResult) return null;
  const q = normalize(question);
  const m = ctx.matchResult;

  if (/why sai|why (should|would) (i |we )?(shortlist|hire|consider)/.test(q) || q.includes("why sai")) {
    const reasons = m.strongMatches.slice(0, 5).map((s) => s.item);
    const lines =
      reasons.length > 0
        ? reasons.map((r) => `• Clear match on **${r}**`).join("\n")
        : "• Solid coverage on core Application Security themes in the JD";
    return {
      topic: "recruiter_why",
      text: `**Why Sai for this role** (from the current analysis — ${m.score}% ${m.band}):\n\n${lines}\n\n${m.recommendation}`,
    };
  }

  if (/interview question|what should i ask|questions (to|for) (sai|him)/.test(q)) {
    return {
      topic: "recruiter_interview",
      text: `Interview angles grounded in this JD + Sai's verified profile:

• Walk through a **STRIDE** threat model he led — what changed in the design?
• How did **pre-merge security gates** (Wiz / GitHub Checks) affect developer workflow?
• Example of **SAST/SCA** findings he triaged and how severity was decided
• **AWS** security control he influenced (WAF, IAM, or visibility via Wiz)
• How he runs or supports a **Security Champion** program
• Where he would dig deeper if a requirement like Kubernetes appeared (honest gap discussion)`,
    };
  }

  if (/biggest gap|gaps?\b|missing|what.?s missing/.test(q)) {
    const items = [...m.gaps, ...m.unknowns].map((g) => `• ${g.item}`);
    return {
      topic: "recruiter_gaps",
      text:
        items.length > 0
          ? `**Gaps / not verified for this JD:**\n\n${items.join("\n")}\n\nThese are based on the current profile only — not assumptions.`
          : `No major gaps were flagged against the extracted requirements. Still worth validating seniority and domain depth in interview.`,
    };
  }

  if (/strongest match|what does he (meet|match)|clearly meet|strengths/.test(q)) {
    const items = m.strongMatches.map((s) => `• ${s.item}`);
    return {
      topic: "recruiter_strengths",
      text:
        items.length > 0
          ? `**Strongest matches for this role:**\n\n${items.join("\n")}`
          : formatMatchResult(m),
    };
  }

  if (/why (is )?(this |it )?(an? )?\d+%|explain (the )?score|match (score|percentage|result)/.test(q)) {
    return {
      topic: "recruiter_match",
      text: formatMatchResult(m),
    };
  }

  if (/shortlist|should i (hire|progress|move forward)/.test(q)) {
    return {
      topic: "recruiter_why",
      text: `Based on the **${m.score}% (${m.band})** analysis:\n\n${m.recommendation}\n\nUse the gaps list in interview rather than assuming tools that aren't verified.`,
    };
  }

  return null;
}

export function answerQuestion(
  question: string,
  ctx: AnswerContext
): AnswerResult {
  const recruiter = recruiterFollowUp(question, ctx);
  if (recruiter) return recruiter;

  const topic = detectTopic(question, ctx.lastTopic);
  const def = TOPICS.find((t) => t.id === topic);
  if (def && topic !== "unknown") {
    return { text: def.answer, topic };
  }

  // Concise unknown — no FAQ dump
  return {
    topic: "unknown",
    text: `I don't have verified information on that in Sai's current profile. Ask about his AppSec experience, tools (Wiz, JFrog, Checkmarx), threat modelling, AWS, career history, or hobbies — or analyze a job in Recruiter mode.`,
  };
}

export function dynamicSuggestions(
  mode: Mode,
  lastTopic?: TopicId | null,
  hasJob?: boolean
): string[] {
  if (mode === "recruiter" && hasJob) {
    return [
      "What are Sai's strongest matches?",
      "What's the biggest gap?",
      "Why Sai?",
      "What should I ask Sai in an interview?",
    ];
  }
  if (lastTopic === "aws") {
    return [
      "What cloud-security work has he done?",
      "Does Sai have Wiz experience?",
      "Tell me about Sai's DAZN experience",
    ];
  }
  if (lastTopic === "threat_modelling") {
    return [
      "What is Sai's STRIDE experience?",
      "What security projects has Sai worked on?",
      "Does Sai have SAST experience?",
    ];
  }
  if (mode === "career") {
    return [
      "Which experience should Sai emphasize?",
      "What are the biggest potential gaps for AppSec roles?",
      "How relevant is AI/LLM security to Sai's background?",
    ];
  }
  return [
    "Who is Sai?",
    "What does Sai specialize in?",
    "Does Sai have threat modelling experience?",
    "What are Sai's hobbies?",
  ];
}
