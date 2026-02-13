# Supabase Setup (Phase 4C)

This directory contains the core schema and Row Level Security migration for Phase 4.

## Files

- `migrations/20260213_phase4_core_schema.sql`
- `migrations/20260213_phase4_echoes_metadata.sql`
- `migrations/20260213_phase4_echo_responses_metadata.sql`

## Apply in Supabase

1. Create a Supabase project.
2. In project settings, copy:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Add them to your local `.env.local`.
4. Open the Supabase SQL Editor and run migrations in order:
   - `migrations/20260213_phase4_core_schema.sql`
   - `migrations/20260213_phase4_echoes_metadata.sql`
   - `migrations/20260213_phase4_echo_responses_metadata.sql`

## Verification Queries

Run these in SQL Editor to verify the migration:

```sql
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in (
    'users',
    'lesson_progress',
    'reflections',
    'streak_records',
    'exercises_completed',
    'identity_statements',
    'weekly_checkins',
    'monthly_assessments',
    'community_echoes',
    'echo_responses'
  )
order by table_name;
```

```sql
select schemaname, tablename, policyname
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
```

## Notes

- `users.id` is linked to `auth.users.id`.
- Content identifiers like `lesson_id` remain text for now because lesson content is currently file-based.
- Community feed tables are configured for authenticated read access and owner-only writes/updates/deletes.
