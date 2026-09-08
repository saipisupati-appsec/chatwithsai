import { Mode } from "./types";

const PROFILE = {
  name: "Balasubramanya Sai Kumar",
  title: "Application Security Engineer",
  experienceYears: "8+ years of combined software engineering and security experience",
  securityFocus: "April 2020 – Present",
  summary: `Balasubramanya Sai Kumar is an Application Security Engineer with 8+ years of combined software engineering and security experience. His security experience includes Application Security, Secure SDLC, DevSecOps, Cloud Security, Threat Modelling, Secure Code Reviews, SAST, DAST, SCA, Vulnerability Management, Risk Assessment, and Security Automation.

He has experience integrating security controls into CI/CD using GitHub Advanced Security, Wiz CI, GitHub Checks, and Security Gates. He has experience with AWS cloud security and AI/LLM security initiatives.

Important distinction:
• Software development experience: March 2018 – April 2020
• Security-focused experience: April 2020 – Present`,
};

const EMPLOYMENT = [
  {
    company: "DAZN Software Private Limited",
    role: "Application Security Engineer",
    location: "Hyderabad, Telangana",
    period: "June 2023 – Present",
    highlights: [
      "STRIDE-based threat modelling across 50+ applications",
      "Secure design reviews, API security, secrets management",
      "SAST, SCA, GHAS, Wiz CI, GitHub Actions & Checks",
      "Pre-merge security gates blocking high-risk PRs (CVSS >9)",
      "AI-driven application security testing using Nullify",
      "AWS cloud security, Wiz, Wiz Sensor, Helix AI security",
      "JFrog Artifactory & Xray, Checkmarx Dev Assist",
      "Security Champion programmes, ISO 27001 compliance",
    ],
  },
  {
    company: "Pole to Win International Pvt Ltd",
    role: "Security Engineer",
    location: "Hyderabad, Telangana",
    period: "February 2022 – May 2023",
    highlights: [
      "Vulnerability remediation across 30+ applications",
      "OWASP Top 10 risk prioritization, secure code reviews",
      "SAST with Checkmarx and Fortify",
      "Security monitoring across 40+ applications",
      "Security Champion programmes, penetration testing support",
    ],
  },
  {
    company: "Wells Fargo International Solutions Pvt. Ltd",
    role: "Tech Operations Senior Analyst",
    location: "Hyderabad, Telangana",
    period: "April 2020 – February 2022",
    highlights: [
      "SAST on .NET, Java and Python",
      "Code-level vulnerability analysis, triage and prioritization",
      "Checkmarx, Fortify, Audit Workbench, ThreadFix",
      "Secure coding standards and remediation coordination",
    ],
  },
  {
    company: "VSoft Technologies Pvt. Ltd",
    role: "Junior Engineer – Development",
    location: "Hyderabad",
    period: "March 2018 – April 2020",
    highlights: [
      "C#, ASP.NET, .NET, JavaScript, ADO.NET, SQL Server, Oracle",
      "100+ C# classes, 20+ frontend modules, 50+ business modules",
      "Agile development and third-party library integration",
    ],
  },
];

const SKILLS = {
  "Application Security": [
    "Application Security",
    "Secure SDLC",
    "Secure-by-Design",
    "Threat Modelling",
    "STRIDE",
    "Secure Code Reviews",
    "OWASP Top 10",
    "Vulnerability Management",
    "Risk Assessment",
  ],
  "Security Testing": [
    "SAST",
    "DAST",
    "SCA",
    "Secrets Scanning",
    "Web Security Testing",
    "API Security Testing",
    "Penetration Testing Support",
    "Vulnerability Validation",
    "Exploitability Assessment",
  ],
  "Cloud / DevSecOps": [
    "AWS",
    "Azure",
    "WAF",
    "IAM",
    "GitHub Actions",
    "GitHub Advanced Security",
    "Wiz CI",
    "GitHub Checks",
    "Security Gates",
  ],
  "AI / LLM Security": [
    "AI/LLM Security",
    "Prompt Injection",
    "Data Protection",
    "Input/Output Validation",
    "Access Control",
    "Controlled AI Access",
    "AI-assisted Developer Tooling",
  ],
  "Security Tools": [
    "Wiz",
    "Wiz Sensor",
    "Checkmarx",
    "Checkmarx Dev Assist",
    "Fortify",
    "Nullify",
    "Burp Suite",
    "JFrog Xray",
    "JFrog Artifactory",
    "ThreadFix",
    "Audit Workbench",
  ],
  Programming: ["C#", "ASP.NET", ".NET", "Python", "Java", "JavaScript", "Bash", "SQL"],
  "Frameworks / Standards": ["OWASP", "MITRE ATT&CK", "ISO 27001", "Agile", "Scrum"],
};

const ACHIEVEMENTS = [
  "Implemented pre-merge security gates using Wiz and GitHub Checks, blocking high-risk PRs with CVSS >9.",
  "Integrated SAST, SCA, GHAS and Wiz CI into CI/CD pipelines.",
  "Conducted STRIDE-based threat modelling across 50+ applications.",
  "Supported AI/LLM security initiatives for Helix AI.",
  "Improved cloud security visibility using Wiz and Wiz Sensor.",
  "Strengthened software supply-chain security using JFrog Artifactory and Xray.",
  "Used Nullify for AI-driven application security testing.",
  "Collaborated with HackerOne security researchers.",
  "Supported ISO 27001 compliance and audit activities.",
];

const EDUCATION = {
  degree: "Bachelor of Technology – Electronics and Communication Engineering",
  institution: "KITS, affiliated to JNTU-HYD",
  year: "2017",
};

function normalize(text: string): string {
  return text.toLowerCase().trim();
}

function containsAny(text: string, keywords: string[]): boolean {
  const n = normalize(text);
  return keywords.some((k) => n.includes(normalize(k)));
}

export function getMockResponse(question: string, mode: Mode): string {
  const q = normalize(question);

  // Out-of-scope detection
  if (
    containsAny(q, [
      "weather",
      "apple revenue",
      "google ceo",
      "write me a python",
      "write a python",
      "current news",
      "stock price",
      "bitcoin",
      "who is the president",
    ])
  ) {
    return `I'm ChatWithSai, focused on Sai's professional experience, skills, projects and career fit. I can answer questions about Application Security expertise, tools, projects, and job matching — but I don't provide general information or act as a general-purpose assistant.`;
  }

  // === GENERAL MODE ===
  if (mode === "general" || mode === "career") {
    if (containsAny(q, ["who is sai", "about sai", "tell me about sai", "introduce sai"])) {
      return PROFILE.summary;
    }

    if (containsAny(q, ["specialize", "specialisation", "expertise", "what does sai do"])) {
      return `Sai specializes in **Application Security** and **Product Security**.

Core areas:
• Application Security & Secure SDLC
• Threat Modelling (STRIDE)
• Secure Code Reviews
• SAST / DAST / SCA
• DevSecOps & CI/CD security gates
• Cloud Security (AWS, WAF, IAM)
• AI/LLM Security
• Vulnerability Management & Risk Assessment

He currently works as an Application Security Engineer at DAZN.`;
    }

    if (containsAny(q, ["experience", "years of experience", "how long"])) {
      return `Sai has **8+ years** of combined software engineering and security experience.

Breakdown:
• **Software development**: March 2018 – April 2020 (VSoft Technologies)
• **Security-focused experience**: April 2020 – Present (Wells Fargo → Pole to Win → DAZN)

He does **not** claim 8+ years of pure Application Security experience. Security-focused work began in April 2020.`;
    }

    if (containsAny(q, ["current role", "current job", "where does sai work", "dazn"])) {
      return `**Current Role**

**Application Security Engineer** at DAZN Software Private Limited  
Hyderabad, Telangana | June 2023 – Present

Key responsibilities and achievements:
• STRIDE-based threat modelling across 50+ applications
• Secure design reviews, API security, secrets management
• Integrated SAST, SCA, GHAS, Wiz CI into CI/CD
• Pre-merge security gates that block high-risk PRs (CVSS > 9)
• AI-driven testing with Nullify
• AWS cloud security, Wiz & Wiz Sensor
• JFrog Artifactory / Xray, Checkmarx Dev Assist
• Security Champion programmes and ISO 27001 support`;
    }

    if (containsAny(q, ["jfrog", "artifactory", "xray"])) {
      return `Sai has hands-on experience with **JFrog Artifactory** and **JFrog Xray**.

At DAZN he used them to strengthen software supply-chain security — scanning artifacts for vulnerabilities and enforcing security policies in the development pipeline.`;
    }

    if (containsAny(q, ["wiz", "wiz sensor", "wiz ci"])) {
      return `Sai has strong experience with the **Wiz** platform:

• **Wiz CI** – integrated into CI/CD pipelines
• **Wiz Sensor** – improved cloud security visibility
• Used for cloud security posture and pre-merge security gates

At DAZN he implemented pre-merge security gates using Wiz and GitHub Checks that block high-risk PRs with CVSS > 9.`;
    }

    if (containsAny(q, ["threat model", "stride", "threat modelling"])) {
      return `Sai has conducted **STRIDE-based threat modelling across 50+ applications** while at DAZN.

He also performs secure design reviews as part of the Secure SDLC process.`;
    }

    if (containsAny(q, ["sast", "static analysis", "checkmarx", "fortify"])) {
      return `Sai has extensive **SAST** experience:

• Tools: **Checkmarx**, **Checkmarx Dev Assist**, **Fortify**, GitHub Advanced Security
• Performed SAST on .NET, Java and Python codebases
• Integrated SAST into CI/CD pipelines with security gates
• Code-level vulnerability analysis, triage and prioritization

He has used these tools across Wells Fargo, Pole to Win and DAZN.`;
    }

    if (containsAny(q, ["aws", "cloud security", "amazon"])) {
      return `Yes — Sai has **AWS cloud security** experience.

At DAZN he works with:
• AWS cloud security controls
• WAF
• IAM
• Integration of cloud security tooling (Wiz / Wiz Sensor)

He also has exposure to Azure and Azure AD.`;
    }

    if (containsAny(q, ["kubernetes", "k8s", "eks", "aks", "gke"])) {
      return `**Unknown / Gap** — Kubernetes (or EKS/AKS/GKE) experience is not currently documented in Sai's profile.

Sai has strong AWS and cloud security experience, but Kubernetes is not listed among his verified skills.`;
    }

    if (containsAny(q, ["go ", "golang", " go."])) {
      return `**Unknown / Gap** — Go (Golang) experience is not currently documented in Sai's profile.

Primary programming languages in the knowledge base: C#, ASP.NET, .NET, Python, Java, JavaScript, Bash, SQL.`;
    }

    if (containsAny(q, ["python"])) {
      return `Yes — Sai has **Python** experience.

He has used Python for:
• Security automation and reporting
• SAST analysis on Python codebases
• General scripting in security workflows`;
    }

    if (containsAny(q, ["project", "projects", "worked on", "built"])) {
      return `**Key security work & initiatives** (not personal side-projects):

• Pre-merge security gates (Wiz + GitHub Checks) blocking CVSS > 9 PRs
• Integration of SAST, SCA, GHAS and Wiz CI into CI/CD
• STRIDE threat modelling across 50+ applications
• AI/LLM security support for Helix AI
• Cloud security visibility with Wiz & Wiz Sensor
• Supply-chain security with JFrog Artifactory & Xray
• AI-driven AppSec testing with Nullify
• Collaboration with HackerOne researchers
• ISO 27001 compliance and audit support`;
    }

    if (containsAny(q, ["skill", "skills", "technical skills", "tools"])) {
      return `**Technical Skills**

**Application Security**  
Application Security, Secure SDLC, Secure-by-Design, Threat Modelling, STRIDE, Secure Code Reviews, OWASP Top 10, Vulnerability Management, Risk Assessment

**Security Testing**  
SAST, DAST, SCA, Secrets Scanning, Web & API Security Testing, Vulnerability Validation

**Cloud / DevSecOps**  
AWS, Azure, WAF, IAM, GitHub Actions, GitHub Advanced Security, Wiz CI, GitHub Checks, Security Gates

**AI / LLM Security**  
AI/LLM Security, Prompt Injection, Data Protection, Input/Output Validation, Access Control

**Security Tools**  
Wiz, Wiz Sensor, Checkmarx, Checkmarx Dev Assist, Fortify, Nullify, Burp Suite, JFrog Xray, JFrog Artifactory, ThreadFix

**Programming**  
C#, ASP.NET, .NET, Python, Java, JavaScript, Bash, SQL`;
    }

    if (containsAny(q, ["education", "degree", "university", "college"])) {
      return `**Education**

Bachelor of Technology – Electronics and Communication Engineering  
KITS, affiliated to JNTU-HYD  
2017`;
    }

    if (containsAny(q, ["achievement", "achievements", "accomplishment"])) {
      return `**Key Achievements**

${ACHIEVEMENTS.map((a) => `• ${a}`).join("\n")}`;
    }

    if (containsAny(q, ["employment", "work history", "career history", "previous companies"])) {
      return EMPLOYMENT.map(
        (e) =>
          `**${e.role}** — ${e.company}\n${e.location} | ${e.period}\n${e.highlights
            .map((h) => `• ${h}`)
            .join("\n")}`
      ).join("\n\n");
    }
  }

  // === RECRUITER MODE ===
  if (mode === "recruiter") {
    if (containsAny(q, ["fit this job", "match this", "does sai fit", "job match", "analyze"])) {
      return `**Recruiter Mode – Job Analysis (Phase 1 Mock)**

In the full version this will:
1. Safely fetch the job URL (SSRF-protected)
2. Extract & normalize the job description
3. Run a **deterministic** matching engine
4. Return Match %, Strengths, Partial matches, Gaps and Recommendation

For now (Phase 1) please paste the key requirements or ask specific questions such as:
• “Does Sai have AWS experience?”
• “What is Sai’s threat modelling experience?”
• “Does Sai have Kubernetes?”

You can also switch to **General** mode for profile questions.`;
    }

    if (containsAny(q, ["match percentage", "score", "how well"])) {
      return `Match scoring is handled by a **deterministic engine** (not the LLM).

Weighting (V1):
• Required skills: 40%
• Experience: 20%
• Responsibilities: 20%
• Nice-to-have skills: 10%
• Education/certifications: 10%

Ratings:
• 85–100: Strong match
• 70–84: Good match
• 50–69: Moderate match
• 0–49: Limited match

This will be fully implemented in a later phase. For Phase 1, ask about specific skills.`;
    }
  }

  // === CAREER MODE ===
  if (mode === "career") {
    if (containsAny(q, ["should sai apply", "recommend", "worth applying", "gap"])) {
      return `**Career guidance (Phase 1)**

I can help reason about gaps once a job description is analyzed.

General principle from the knowledge base:
• Sai has strong depth in Application Security, Threat Modelling, SAST/SCA, CI/CD security gates, AWS and modern AppSec tooling.
• Documented gaps (examples): Go, Kubernetes — these are currently **Unknown** in the profile.

In later phases I will provide tailored recommendations such as:
• Which experiences to emphasize
• How to position against a specific gap
• Whether the role is still a strong fit despite missing items

For now, ask about specific skills or experience areas.`;
    }
  }

  // Fallback for any mode
  if (containsAny(q, ["hello", "hi ", "hey", "good morning", "good afternoon"])) {
    return `Hello! I'm **ChatWithSai** — Ask about Sai.

I can tell you about Sai's Application Security experience, tools, projects, employment history, and career fit.

Try one of the suggested questions or ask anything about Sai's professional background.`;
  }

  // Default response
  return `I'm ChatWithSai, focused on Sai's professional experience, skills, projects and career fit.

I don't have a specific answer for that exact question yet in the current knowledge base.

You can ask about:
• Who Sai is and what he specializes in
• Application Security / Threat Modelling / SAST experience
• Specific tools (Wiz, JFrog, Checkmarx, Nullify, etc.)
• AWS / Cloud Security
• Employment history and achievements
• Education

Or switch modes (General / Recruiter / Career) for more targeted help.`;
}

export const SUGGESTED_QUESTIONS: Record<Mode, string[]> = {
  general: [
    "Who is Sai?",
    "What does Sai specialize in?",
    "What is Sai's JFrog experience?",
    "Tell me about Sai's AppSec experience",
    "Does Sai have AWS experience?",
    "What security projects has Sai worked on?",
  ],
  recruiter: [
    "Does Sai fit this job?",
    "What are Sai's strongest security skills?",
    "Does Sai have threat modelling experience?",
    "Does Sai have Kubernetes experience?",
    "What is Sai's experience with SAST tools?",
  ],
  career: [
    "Should Sai apply despite a skill gap?",
    "Which experience should Sai emphasize?",
    "What are the biggest potential gaps for AppSec roles?",
    "How relevant is AI/LLM security to Sai's background?",
  ],
};
