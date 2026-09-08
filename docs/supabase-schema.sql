-- ChatWithSai Supabase schema (apply when credentials are available)
-- Do not store personal phone/email or secrets.

-- enable vector if using pgvector RAG
-- create extension if not exists vector;

create table if not exists knowledge_documents (
  id uuid primary key default gen_random_uuid(),
  path text not null unique,
  category text not null,
  content text not null,
  knowledge_version text not null,
  created_at timestamptz default now()
);

create table if not exists job_analyses (
  id uuid primary key default gen_random_uuid(),
  jd_hash text not null unique,
  requirements jsonb not null,
  match_result jsonb not null,
  knowledge_version text not null,
  algorithm_version text not null,
  source_url text,
  created_at timestamptz default now()
);

create table if not exists chat_sessions (
  id uuid primary key default gen_random_uuid(),
  mode text not null,
  job_analysis_id uuid references job_analyses(id),
  question_count int not null default 0,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

create table if not exists chat_questions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references chat_sessions(id),
  role text not null,
  content text not null,
  created_at timestamptz default now()
);

create index if not exists idx_job_analyses_hash on job_analyses(jd_hash);
create index if not exists idx_sessions_expires on chat_sessions(expires_at);
