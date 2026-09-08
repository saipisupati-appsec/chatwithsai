# ChatWithSai

**Ask about Sai.**

Professional AI profile for **Balasubramanya Sai Kumar** — Application Security experience, skills, projects, and career fit.

ChatWithSai is **not** a general-purpose chatbot. All answers stay grounded in Sai's verified professional profile.

---

## Current status (feature/production-v1)

| Area | Status |
|------|--------|
| Three modes (General / Recruiter / Career) | ✅ |
| Responsive UI + Light/Dark/System theme | ✅ |
| Structured knowledge base (`knowledge/`) | ✅ |
| Deterministic skill verification | ✅ |
| Deterministic matching engine (core) | ✅ |
| SSRF protection utilities | ✅ |
| Hard limits configuration | ✅ |
| Job URL fetch + extraction | ⏳ Pending |
| Server-side 10-question limit | ⏳ Pending |
| Supabase + caching | ⏳ Pending |
| RAG | ⏳ Pending |
| Groq / OpenRouter | ⏳ Pending |
| Full test suite + CI/CD | ⏳ Pending |
| Cloudflare deployment config | ⏳ Pending |

Knowledge version: **1.0.0**  
Matching algorithm version: **1.0.0**

---

## Three modes

1. **General** — Questions about Sai's experience, skills, tools, projects.
2. **Recruiter** — Job fit analysis (paste JD or URL), match %, strengths, gaps, follow-ups (max 10).
3. **Career** — Positioning, gaps, what to emphasize, application advice.

---

## Core principles

- **AI when necessary. Deterministic when possible. Cached whenever reusable. Hard-limited everywhere.**
- Never invent experience or skills.
- Unknown technologies stay **UNKNOWN** (e.g. Kubernetes, Go, Ruby, TypeScript).
- Job pages are untrusted data — never treated as instructions.
- No secrets in the client bundle.

---

## Local development

```bash
npm install
npm run dev
```

App runs at **http://localhost:4567**

```bash
npm run lint
npm run build
```

---

## Environment variables

Copy `.env.example` → `.env.local` and fill real values when you enable backend features.

```
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GROQ_API_KEY=
OPENROUTER_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:4567
```

**Never commit `.env.local` or real credentials.**

---

## Project structure (current)

```
chatwithsai/
├── knowledge/                  # Authoritative Sai profile (v1.0.0)
│   ├── VERSION
│   ├── profile/
│   ├── experience/
│   ├── skills/
│   ├── projects/
│   ├── achievements/
│   └── education/
├── src/
│   ├── app/
│   ├── components/
│   └── lib/
│       ├── knowledge.ts        # Deterministic skill checks
│       ├── matching.ts         # Deterministic match engine
│       ├── mock-responses.ts   # Phase 1 response logic (still active)
│       ├── theme.ts
│       └── security/
│           ├── ssrf.ts
│           └── limits.ts
├── .env.example
└── package.json
```

---

## Matching weights (deterministic)

| Category              | Weight |
|-----------------------|--------|
| Required skills       | 40%    |
| Experience            | 20%    |
| Responsibilities      | 20%    |
| Nice-to-have skills   | 10%    |
| Education/certs       | 10%    |

Bands: 85–100 Strong · 70–84 Good · 50–69 Moderate · 0–49 Limited

---

## Security notes (in progress)

- SSRF: HTTPS only, private IP / metadata / localhost blocked, DNS rebinding checks, max 3 redirects, 10s timeout, 5 MB limit.
- Prompt injection: external job content treated as data only.
- Secrets: never in frontend, never committed.
- Recruiter 10-question limit will be enforced server-side.

---

## Roadmap remaining

- Secure job ingestion + extraction pipeline
- API routes + server-side session / question counting
- Supabase schema + job analysis cache
- RAG over knowledge base
- Groq primary + OpenRouter fallback
- Rate limiting & cost controls
- Unit / integration / security tests
- GitHub Actions CI/CD
- Cloudflare Pages/Workers deployment config

---

## License / usage

Personal professional profile project for Balasubramanya Sai Kumar.
