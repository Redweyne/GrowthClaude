-- User Progress Blob: Stores full Zustand state as JSONB for reliable backup/restore.
-- Run this in Supabase SQL Editor after the Phase 4 core schema migration.

create table if not exists public.user_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  main_store jsonb not null default '{}'::jsonb,
  tasks_store jsonb not null default '{}'::jsonb,
  echoes_store jsonb not null default '{}'::jsonb,
  daily_practice_store jsonb not null default '{}'::jsonb,
  spark_store jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Auto-update timestamp
drop trigger if exists user_progress_set_updated_at on public.user_progress;
create trigger user_progress_set_updated_at
before update on public.user_progress
for each row
execute procedure public.set_updated_at();

-- Row Level Security
alter table public.user_progress enable row level security;

drop policy if exists "user_progress_select_own" on public.user_progress;
create policy "user_progress_select_own" on public.user_progress
for select to authenticated
using (user_id = auth.uid());

drop policy if exists "user_progress_insert_own" on public.user_progress;
create policy "user_progress_insert_own" on public.user_progress
for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists "user_progress_update_own" on public.user_progress;
create policy "user_progress_update_own" on public.user_progress
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());
