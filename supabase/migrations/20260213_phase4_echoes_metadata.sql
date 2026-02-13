-- Phase 4E: Add metadata columns for community echo synchronization

alter table public.community_echoes
  add column if not exists lesson_id text,
  add column if not exists lesson_title text,
  add column if not exists author_gender text;

create index if not exists community_echoes_lesson_id_idx on public.community_echoes (lesson_id);
