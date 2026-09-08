# ChatWithSai

**Ask about Sai.**

Professional AI profile for **Balasubramanya Sai Kumar** — Application Security experience, skills, projects, and career fit.

Not a general-purpose chatbot. Answers stay grounded in the verified professional profile.

---

## Branch

Active development: **`feature/production-v1`**

---

## What works today

| Feature | Status |
|---------|--------|
| Three modes (General / Recruiter / Career) | ✅ |
| Light / Dark / System theme | ✅ |
| Structured knowledge base v1.0.0 | ✅ |
| Deterministic skill verification (VERIFIED / UNKNOWN) | ✅ |
| Deterministic job matching engine + bands | ✅ |
| Job URL fetch (SSRF-hardened) + paste JD | ✅ |
| HTML → text extraction + skill heuristics | ✅ |
| Server-side recruiter 10-question limit | ✅ |
| In-memory job analysis cache (hash of JD+versions) | ✅ |
| API: `/api/chat`, `/api/jobs/analyze`, `/api/health` | ✅ |
| LLM abstraction (Groq → OpenRouter → deterministic) | ✅ code (needs API keys) |
| Security headers (CSP, XFO, nosniff, …) | ✅ |
| Unit tests (knowledge, matching, SSRF, sessions) | ✅ |
| GitHub Actions CI | ✅ |
| Cloudflare Pages stubs (`wrangler.toml`, `_headers`) | ✅ |
| Supabase persistence / pgvector RAG | ⏳ stubs only (needs credentials) |

---

## Local run

```bash
npm install
npm run dev          # http://localhost:4567
npm run lint
npm run typecheck
npm test
npm run build
```

---

## Environment

Copy `.env.example` → `.env.local` (never commit real secrets):

```
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GROQ_API_KEY=
OPENROUTER_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:4567
```

Without keys the app still works: deterministic answers, matching, SSRF fetch, sessions, and cache.

---

## Architecture (current)

```
Browser
  → Next.js UI (3 modes, theme)
  → /api/chat | /api/jobs/analyze
       → validation + limits
       → SSRF-safe fetch (optional)
       → extract + normalize JD
       → deterministic match / skill check
       → in-memory session (10 Q max)
       → optional LLM (Groq → OpenRouter)
       → response
```

---

## Matching weights

Required skills 40% · Experience 20% · Responsibilities 20% · Nice-to-have 10% · Education 10%

Bands: 85–100 Strong · 70–84 Good · 50–69 Moderate · 0–49 Limited

Unknown skills (Kubernetes, Go, Ruby, TypeScript, …) are never treated as Yes.

---

## Security highlights

- HTTPS-only job URLs; private/metadata/localhost blocked; DNS rebinding checks; max 3 redirects; 10s timeout; 5 MB cap
- Job page content treated as data only (prompt-injection resistant pipeline)
- Server-authoritative recruiter question counter
- No secrets in client bundle; `.env.local` gitignored
- Security headers via `next.config.ts` + Cloudflare `_headers`

---

## Remaining to production-harden

1. Add real `GROQ_API_KEY` / `OPENROUTER_API_KEY` for career reasoning explanations
2. Provision Supabase and apply `docs/supabase-schema.sql`; swap in-memory session/cache
3. Optional: pgvector embeddings for full RAG
4. IP rate limiting at Cloudflare edge
5. Merge `feature/production-v1` → `main` after review
6. Connect Cloudflare Pages project to the repo

---

## License / purpose

Personal professional profile project for Balasubramanya Sai Kumar.
