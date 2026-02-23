-- Phase 4E: Add metadata columns for echo response synchronization

alter table public.echo_responses
  add column if not exists responder_gender text,
  add column if not exists is_open_to_connect boolean not null default false;
