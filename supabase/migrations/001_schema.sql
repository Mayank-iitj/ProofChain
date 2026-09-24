create extension if not exists vector;

create table if not exists projects (
  id uuid primary key,
  title text,
  created_at timestamptz,
  owner_id uuid null,
  status text
);

create table if not exists claims (
  id uuid primary key,
  project_id uuid references projects(id),
  parent_claim_id uuid references claims(id),
  text text not null,
  claim_type text,
  entities jsonb,
  quantity jsonb,
  timeframe jsonb,
  scope jsonb,
  decomposition_confidence numeric,
  created_at timestamptz
);

create table if not exists sources (
  id uuid primary key,
  canonical_url text unique not null,
  title text,
  publisher text,
  domain text,
  author text,
  published_at timestamptz null,
  accessed_at timestamptz,
  source_type text,
  metadata jsonb,
  content_hash text,
  fetch_status text
);

create table if not exists evidence (
  id uuid primary key,
  source_id uuid references sources(id),
  claim_id uuid references claims(id),
  passage text not null,
  passage_locator jsonb,
  extraction_method text,
  relevance_score numeric,
  quality_score numeric,
  embedding vector(1536) null,
  created_at timestamptz
);

create index if not exists evidence_embedding_hnsw on evidence using hnsw (embedding vector_cosine_ops);

create table if not exists relationships (
  id uuid primary key,
  claim_id uuid references claims(id),
  evidence_id uuid references evidence(id),
  relation text,
  confidence numeric,
  rationale text,
  model_version text,
  created_at timestamptz
);

create table if not exists search_runs (
  id uuid primary key,
  project_id uuid references projects(id),
  claim_id uuid references claims(id),
  provider text,
  query text,
  started_at timestamptz,
  completed_at timestamptz,
  result_count integer,
  status text,
  raw_metadata jsonb
);

create table if not exists verification_runs (
  id uuid primary key,
  project_id uuid references projects(id) null,
  user_id uuid null,
  status text,
  coverage_score numeric,
  support_count integer,
  partial_count integer,
  contradiction_count integer,
  unresolved_count integer,
  model_versions jsonb,
  json_data jsonb,
  created_at timestamptz,
  completed_at timestamptz
);

create table if not exists audit_events (
  id uuid primary key,
  verification_run_id uuid references verification_runs(id),
  event_type text,
  payload jsonb,
  created_at timestamptz
);

create or replace function match_evidence (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  source_id uuid,
  claim_id uuid,
  passage text,
  passage_locator jsonb,
  extraction_method text,
  relevance_score numeric,
  quality_score numeric,
  similarity float
)
language sql stable
as $$
  select
    evidence.id,
    evidence.source_id,
    evidence.claim_id,
    evidence.passage,
    evidence.passage_locator,
    evidence.extraction_method,
    evidence.relevance_score,
    evidence.quality_score,
    1 - (evidence.embedding <=> query_embedding) as similarity
  from evidence
  where 1 - (evidence.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
$$;
