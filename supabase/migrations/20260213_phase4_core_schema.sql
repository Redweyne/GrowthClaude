-- Phase 4C: Core Supabase schema + Row Level Security
-- Run this in Supabase SQL Editor or with supabase db push.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- USERS
-- ---------------------------------------------------------------------------
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  email text,
  name text,
  avatar_url text,
  transformation_goal text,
  why_statement text,
  daily_commitment_minutes int not null default 5,
  total_xp int not null default 0,
  current_level int not null default 1,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  grace_days int not null default 1,
  last_lesson_at timestamptz,
  streak_start_date timestamptz,
  notifications_enabled boolean not null default true,
  preferred_time text,
  sound_enabled boolean not null default true,
  haptic_enabled boolean not null default true,
  onboarding_complete boolean not null default false,
  language text,
  community_identity text,
  last_checkin_date date,
  last_assessment_month text,
  created_via text,
  constraint users_daily_commitment_chk check (daily_commitment_minutes >= 1 and daily_commitment_minutes <= 60)
);

create index if not exists users_email_idx on public.users (email);
create index if not exists users_onboarding_complete_idx on public.users (onboarding_complete);

-- ---------------------------------------------------------------------------
-- LESSON PROGRESS
-- ---------------------------------------------------------------------------
create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  lesson_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed boolean not null default false,
  completed_at timestamptz,
  action_completed boolean not null default false,
  reflection_written boolean not null default false,
  time_spent_seconds int not null default 0,
  xp_earned int not null default 0,
  last_practiced_at timestamptz,
  practice_count int not null default 0,
  mastery_level int not null default 0,
  unique (user_id, lesson_id),
  constraint lesson_progress_mastery_level_chk check (mastery_level >= 0 and mastery_level <= 5)
);

create index if not exists lesson_progress_user_idx on public.lesson_progress (user_id);
create index if not exists lesson_progress_completed_idx on public.lesson_progress (user_id, completed);

-- ---------------------------------------------------------------------------
-- REFLECTIONS
-- ---------------------------------------------------------------------------
create table if not exists public.reflections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  lesson_id text not null,
  created_at timestamptz not null default now(),
  content text not null,
  word_count int not null default 0,
  sentiment text,
  action_honesty text,
  is_public boolean not null default true
);

create index if not exists reflections_user_idx on public.reflections (user_id, created_at desc);
create index if not exists reflections_lesson_idx on public.reflections (lesson_id);

-- ---------------------------------------------------------------------------
-- STREAK RECORDS
-- ---------------------------------------------------------------------------
create table if not exists public.streak_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  date date not null,
  completed boolean not null default true,
  grace_day_used boolean not null default false,
  xp_earned int not null default 0,
  current_streak int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, date)
);

create index if not exists streak_records_user_date_idx on public.streak_records (user_id, date desc);

-- ---------------------------------------------------------------------------
-- EXERCISES COMPLETED
-- ---------------------------------------------------------------------------
create table if not exists public.exercises_completed (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  lesson_id text not null,
  exercise_id text not null,
  score int,
  metadata jsonb not null default '{}'::jsonb,
  completed_at timestamptz not null default now(),
  unique (user_id, lesson_id, exercise_id)
);

create index if not exists exercises_completed_user_idx on public.exercises_completed (user_id, completed_at desc);

-- ---------------------------------------------------------------------------
-- IDENTITY STATEMENTS
-- ---------------------------------------------------------------------------
create table if not exists public.identity_statements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  statement text not null,
  context jsonb not null default '{}'::jsonb,
  tags text[] not null default '{}',
  triggered_by_lesson_id text,
  world_slug text
);

create index if not exists identity_statements_user_idx on public.identity_statements (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- WEEKLY CHECKINS
-- ---------------------------------------------------------------------------
create table if not exists public.weekly_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  week_of date not null,
  awareness_rating int,
  action_rating int,
  progress_feeling int,
  biggest_win text,
  biggest_challenge text,
  next_week_intention text,
  responses jsonb not null default '[]'::jsonb,
  xp_earned int not null default 50,
  unique (user_id, week_of),
  constraint weekly_checkins_awareness_rating_chk check (awareness_rating is null or (awareness_rating >= 1 and awareness_rating <= 10)),
  constraint weekly_checkins_action_rating_chk check (action_rating is null or (action_rating >= 1 and action_rating <= 10)),
  constraint weekly_checkins_progress_feeling_chk check (progress_feeling is null or (progress_feeling >= 1 and progress_feeling <= 10))
);

create index if not exists weekly_checkins_user_idx on public.weekly_checkins (user_id, week_of desc);

-- ---------------------------------------------------------------------------
-- MONTHLY ASSESSMENTS
-- ---------------------------------------------------------------------------
create table if not exists public.monthly_assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  month text not null,
  emotional_mastery int not null,
  discipline int not null,
  perspective int not null,
  self_awareness int not null,
  growth int not null,
  reflection text,
  xp_earned int not null default 100,
  unique (user_id, month),
  constraint monthly_assessments_emotional_mastery_chk check (emotional_mastery between 1 and 10),
  constraint monthly_assessments_discipline_chk check (discipline between 1 and 10),
  constraint monthly_assessments_perspective_chk check (perspective between 1 and 10),
  constraint monthly_assessments_self_awareness_chk check (self_awareness between 1 and 10),
  constraint monthly_assessments_growth_chk check (growth between 1 and 10)
);

create index if not exists monthly_assessments_user_idx on public.monthly_assessments (user_id, month desc);

-- ---------------------------------------------------------------------------
-- COMMUNITY ECHOES
-- ---------------------------------------------------------------------------
create table if not exists public.community_echoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  reflection_id uuid references public.reflections(id) on delete set null,
  content text not null,
  is_open_to_connect boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists community_echoes_created_idx on public.community_echoes (created_at desc);
create index if not exists community_echoes_user_idx on public.community_echoes (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- ECHO RESPONSES
-- ---------------------------------------------------------------------------
create table if not exists public.echo_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  echo_id uuid not null references public.community_echoes(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists echo_responses_echo_idx on public.echo_responses (echo_id, created_at asc);
create index if not exists echo_responses_user_idx on public.echo_responses (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- UPDATED_AT TRIGGERS
-- ---------------------------------------------------------------------------
drop trigger if exists users_set_updated_at on public.users;
create trigger users_set_updated_at
before update on public.users
for each row
execute procedure public.set_updated_at();

drop trigger if exists lesson_progress_set_updated_at on public.lesson_progress;
create trigger lesson_progress_set_updated_at
before update on public.lesson_progress
for each row
execute procedure public.set_updated_at();

drop trigger if exists streak_records_set_updated_at on public.streak_records;
create trigger streak_records_set_updated_at
before update on public.streak_records
for each row
execute procedure public.set_updated_at();

drop trigger if exists community_echoes_set_updated_at on public.community_echoes;
create trigger community_echoes_set_updated_at
before update on public.community_echoes
for each row
execute procedure public.set_updated_at();

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ---------------------------------------------------------------------------
alter table public.users enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.reflections enable row level security;
alter table public.streak_records enable row level security;
alter table public.exercises_completed enable row level security;
alter table public.identity_statements enable row level security;
alter table public.weekly_checkins enable row level security;
alter table public.monthly_assessments enable row level security;
alter table public.community_echoes enable row level security;
alter table public.echo_responses enable row level security;

-- USERS
drop policy if exists "users_select_own" on public.users;
create policy "users_select_own" on public.users
for select to authenticated
using (id = auth.uid());

drop policy if exists "users_insert_own" on public.users;
create policy "users_insert_own" on public.users
for insert to authenticated
with check (id = auth.uid());

drop policy if exists "users_update_own" on public.users;
create policy "users_update_own" on public.users
for update to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "users_delete_own" on public.users;
create policy "users_delete_own" on public.users
for delete to authenticated
using (id = auth.uid());

-- LESSON_PROGRESS
drop policy if exists "lesson_progress_select_own" on public.lesson_progress;
create policy "lesson_progress_select_own" on public.lesson_progress
for select to authenticated
using (user_id = auth.uid());

drop policy if exists "lesson_progress_insert_own" on public.lesson_progress;
create policy "lesson_progress_insert_own" on public.lesson_progress
for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists "lesson_progress_update_own" on public.lesson_progress;
create policy "lesson_progress_update_own" on public.lesson_progress
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "lesson_progress_delete_own" on public.lesson_progress;
create policy "lesson_progress_delete_own" on public.lesson_progress
for delete to authenticated
using (user_id = auth.uid());

-- REFLECTIONS
drop policy if exists "reflections_select_own" on public.reflections;
create policy "reflections_select_own" on public.reflections
for select to authenticated
using (user_id = auth.uid());

drop policy if exists "reflections_insert_own" on public.reflections;
create policy "reflections_insert_own" on public.reflections
for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists "reflections_update_own" on public.reflections;
create policy "reflections_update_own" on public.reflections
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "reflections_delete_own" on public.reflections;
create policy "reflections_delete_own" on public.reflections
for delete to authenticated
using (user_id = auth.uid());

-- STREAK_RECORDS
drop policy if exists "streak_records_select_own" on public.streak_records;
create policy "streak_records_select_own" on public.streak_records
for select to authenticated
using (user_id = auth.uid());

drop policy if exists "streak_records_insert_own" on public.streak_records;
create policy "streak_records_insert_own" on public.streak_records
for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists "streak_records_update_own" on public.streak_records;
create policy "streak_records_update_own" on public.streak_records
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "streak_records_delete_own" on public.streak_records;
create policy "streak_records_delete_own" on public.streak_records
for delete to authenticated
using (user_id = auth.uid());

-- EXERCISES_COMPLETED
drop policy if exists "exercises_completed_select_own" on public.exercises_completed;
create policy "exercises_completed_select_own" on public.exercises_completed
for select to authenticated
using (user_id = auth.uid());

drop policy if exists "exercises_completed_insert_own" on public.exercises_completed;
create policy "exercises_completed_insert_own" on public.exercises_completed
for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists "exercises_completed_update_own" on public.exercises_completed;
create policy "exercises_completed_update_own" on public.exercises_completed
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "exercises_completed_delete_own" on public.exercises_completed;
create policy "exercises_completed_delete_own" on public.exercises_completed
for delete to authenticated
using (user_id = auth.uid());

-- IDENTITY_STATEMENTS
drop policy if exists "identity_statements_select_own" on public.identity_statements;
create policy "identity_statements_select_own" on public.identity_statements
for select to authenticated
using (user_id = auth.uid());

drop policy if exists "identity_statements_insert_own" on public.identity_statements;
create policy "identity_statements_insert_own" on public.identity_statements
for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists "identity_statements_update_own" on public.identity_statements;
create policy "identity_statements_update_own" on public.identity_statements
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "identity_statements_delete_own" on public.identity_statements;
create policy "identity_statements_delete_own" on public.identity_statements
for delete to authenticated
using (user_id = auth.uid());

-- WEEKLY_CHECKINS
drop policy if exists "weekly_checkins_select_own" on public.weekly_checkins;
create policy "weekly_checkins_select_own" on public.weekly_checkins
for select to authenticated
using (user_id = auth.uid());

drop policy if exists "weekly_checkins_insert_own" on public.weekly_checkins;
create policy "weekly_checkins_insert_own" on public.weekly_checkins
for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists "weekly_checkins_update_own" on public.weekly_checkins;
create policy "weekly_checkins_update_own" on public.weekly_checkins
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "weekly_checkins_delete_own" on public.weekly_checkins;
create policy "weekly_checkins_delete_own" on public.weekly_checkins
for delete to authenticated
using (user_id = auth.uid());

-- MONTHLY_ASSESSMENTS
drop policy if exists "monthly_assessments_select_own" on public.monthly_assessments;
create policy "monthly_assessments_select_own" on public.monthly_assessments
for select to authenticated
using (user_id = auth.uid());

drop policy if exists "monthly_assessments_insert_own" on public.monthly_assessments;
create policy "monthly_assessments_insert_own" on public.monthly_assessments
for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists "monthly_assessments_update_own" on public.monthly_assessments;
create policy "monthly_assessments_update_own" on public.monthly_assessments
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "monthly_assessments_delete_own" on public.monthly_assessments;
create policy "monthly_assessments_delete_own" on public.monthly_assessments
for delete to authenticated
using (user_id = auth.uid());

-- COMMUNITY_ECHOES (shared feed)
drop policy if exists "community_echoes_select_authenticated" on public.community_echoes;
create policy "community_echoes_select_authenticated" on public.community_echoes
for select to authenticated
using (true);

drop policy if exists "community_echoes_insert_own" on public.community_echoes;
create policy "community_echoes_insert_own" on public.community_echoes
for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists "community_echoes_update_own" on public.community_echoes;
create policy "community_echoes_update_own" on public.community_echoes
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "community_echoes_delete_own" on public.community_echoes;
create policy "community_echoes_delete_own" on public.community_echoes
for delete to authenticated
using (user_id = auth.uid());

-- ECHO_RESPONSES (shared thread)
drop policy if exists "echo_responses_select_authenticated" on public.echo_responses;
create policy "echo_responses_select_authenticated" on public.echo_responses
for select to authenticated
using (true);

drop policy if exists "echo_responses_insert_own" on public.echo_responses;
create policy "echo_responses_insert_own" on public.echo_responses
for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists "echo_responses_update_own" on public.echo_responses;
create policy "echo_responses_update_own" on public.echo_responses
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "echo_responses_delete_own" on public.echo_responses;
create policy "echo_responses_delete_own" on public.echo_responses
for delete to authenticated
using (user_id = auth.uid());
