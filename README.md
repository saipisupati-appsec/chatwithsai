# ChatWithSai

**Ask about Sai.**

Professional AI profile for Balasubramanya Sai Kumar — Application Security experience, skills, projects, and career fit.

## Phase 1 (Current)

- Next.js 15 + TypeScript + Tailwind CSS
- Three modes: General | Recruiter | Career
- Responsive professional UI
- Suggested questions per mode
- Local deterministic mock responses based on the authoritative Sai profile
- No LLM, no external APIs, no database

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
  app/
    layout.tsx
    page.tsx
    globals.css
  components/
    Header.tsx
    ChatMessage.tsx
    ChatInput.tsx
    SuggestedQuestions.tsx
  lib/
    types.ts
    mock-responses.ts
```

## Next phases (not yet implemented)

- Job URL fetching + SSRF protection
- Deterministic matching engine
- Supabase + caching
- Groq / OpenRouter LLM gateway
- RAG over knowledge base
- Rate limiting & budgets
