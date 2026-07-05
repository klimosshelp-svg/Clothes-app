-- ─────────────────────────────────────────────────────────────
-- Arwin — Supabase schema
-- Run in the Supabase SQL editor (or `supabase db push`).
-- ─────────────────────────────────────────────────────────────

-- Generations: one row per produced image.
create table if not exists public.generations (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  user_id      uuid references auth.users (id) on delete cascade,
  style        text not null check (style in ('model','ghost','flatlay','studio')),
  category     text,
  clothing_url text not null,
  model_url    text,
  result_url   text not null,
  prompt       text,
  provider     text not null default 'mock',
  status       text not null default 'complete'
                 check (status in ('complete','processing','failed'))
);

create index if not exists generations_user_created_idx
  on public.generations (user_id, created_at desc);

-- Row Level Security: users see and manage only their own rows.
alter table public.generations enable row level security;

drop policy if exists "own generations - select" on public.generations;
create policy "own generations - select"
  on public.generations for select
  using (auth.uid() = user_id);

drop policy if exists "own generations - insert" on public.generations;
create policy "own generations - insert"
  on public.generations for insert
  with check (auth.uid() = user_id);

drop policy if exists "own generations - delete" on public.generations;
create policy "own generations - delete"
  on public.generations for delete
  using (auth.uid() = user_id);

-- NOTE: The server uses the service-role key (bypasses RLS) for the MVP,
-- where user_id may be null. Tighten to require auth once Supabase Auth
-- is wired into the API routes.

-- ── Storage ──────────────────────────────────────────────────
-- Create a public bucket named `arwin` (matches SUPABASE_STORAGE_BUCKET):
--   Dashboard → Storage → New bucket → name: arwin → Public.
-- Or via SQL:
insert into storage.buckets (id, name, public)
values ('arwin', 'arwin', true)
on conflict (id) do nothing;
