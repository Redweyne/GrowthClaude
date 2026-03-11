-- ═══════════════════════════════════════════════════════════════════════════
-- PROFILE IDENTITY SYSTEM
-- ═══════════════════════════════════════════════════════════════════════════
-- Adds profile customization columns, server-owned supporter fields,
-- a whitelist RPC for safe client writes, echo author profile RPC,
-- and Supabase Storage bucket for avatar uploads.
-- ═══════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────
-- 1. NEW COLUMNS ON public.users
-- ─────────────────────────────────────────────────────────────────────────

-- Client-writable (via RPC whitelist only)
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS motto text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS accent_color text DEFAULT 'gold';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS banner_key text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS equipped_title_id text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS badges_earned jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS profile_visible_in_echoes boolean DEFAULT false;

-- Server-owned (NEVER client-writable)
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_supporter boolean NOT NULL DEFAULT false;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS supporter_since timestamptz;


-- ─────────────────────────────────────────────────────────────────────────
-- 2. WHITELIST RPC: SAFE CLIENT PROFILE UPDATES
-- ─────────────────────────────────────────────────────────────────────────
-- Replaces direct upsert. Only accepts known safe columns.
-- is_supporter and supporter_since are NEVER accepted.

CREATE OR REPLACE FUNCTION public.update_profile_safe(fields jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  -- Progression fields (total_xp, current_streak, longest_streak, grace_days)
  -- are intentionally EXCLUDED from this whitelist. They sync via the separate
  -- update_profile_progression RPC to enforce separation of concerns.
  allowed_keys text[] := ARRAY[
    'name', 'avatar_url', 'transformation_goal', 'why_statement',
    'daily_commitment_minutes', 'last_lesson_at', 'sound_enabled', 'haptic_enabled',
    'onboarding_complete', 'language', 'community_identity',
    'last_checkin_date', 'last_assessment_month',
    'motto', 'accent_color', 'banner_key', 'equipped_title_id',
    'badges_earned', 'profile_visible_in_echoes'
  ];
  filtered jsonb;
  k text;
BEGIN
  -- Filter to only allowed keys
  filtered := '{}'::jsonb;
  FOR k IN SELECT jsonb_object_keys(fields) LOOP
    IF k = ANY(allowed_keys) THEN
      filtered := filtered || jsonb_build_object(k, fields->k);
    END IF;
  END LOOP;

  -- Upsert using auth.uid() — cannot impersonate another user
  INSERT INTO public.users (id, email)
    VALUES (auth.uid(), (SELECT email FROM auth.users WHERE id = auth.uid()))
    ON CONFLICT (id) DO UPDATE SET
      name                     = CASE WHEN filtered ? 'name' THEN filtered->>'name' ELSE users.name END,
      avatar_url               = CASE WHEN filtered ? 'avatar_url' THEN filtered->>'avatar_url' ELSE users.avatar_url END,
      transformation_goal      = CASE WHEN filtered ? 'transformation_goal' THEN filtered->>'transformation_goal' ELSE users.transformation_goal END,
      why_statement            = CASE WHEN filtered ? 'why_statement' THEN filtered->>'why_statement' ELSE users.why_statement END,
      daily_commitment_minutes = CASE WHEN filtered ? 'daily_commitment_minutes' THEN (filtered->>'daily_commitment_minutes')::int ELSE users.daily_commitment_minutes END,
      last_lesson_at           = CASE WHEN filtered ? 'last_lesson_at' THEN (filtered->>'last_lesson_at')::timestamptz ELSE users.last_lesson_at END,
      sound_enabled            = CASE WHEN filtered ? 'sound_enabled' THEN (filtered->>'sound_enabled')::boolean ELSE users.sound_enabled END,
      haptic_enabled           = CASE WHEN filtered ? 'haptic_enabled' THEN (filtered->>'haptic_enabled')::boolean ELSE users.haptic_enabled END,
      onboarding_complete      = CASE WHEN filtered ? 'onboarding_complete' THEN (filtered->>'onboarding_complete')::boolean ELSE users.onboarding_complete END,
      language                 = CASE WHEN filtered ? 'language' THEN filtered->>'language' ELSE users.language END,
      community_identity       = CASE WHEN filtered ? 'community_identity' THEN filtered->>'community_identity' ELSE users.community_identity END,
      last_checkin_date        = CASE WHEN filtered ? 'last_checkin_date' THEN (filtered->>'last_checkin_date')::date ELSE users.last_checkin_date END,
      last_assessment_month    = CASE WHEN filtered ? 'last_assessment_month' THEN filtered->>'last_assessment_month' ELSE users.last_assessment_month END,
      motto                    = CASE WHEN filtered ? 'motto' THEN filtered->>'motto' ELSE users.motto END,
      accent_color             = CASE WHEN filtered ? 'accent_color' THEN filtered->>'accent_color' ELSE users.accent_color END,
      banner_key               = CASE WHEN filtered ? 'banner_key' THEN filtered->>'banner_key' ELSE users.banner_key END,
      equipped_title_id        = CASE WHEN filtered ? 'equipped_title_id' THEN filtered->>'equipped_title_id' ELSE users.equipped_title_id END,
      badges_earned            = CASE WHEN filtered ? 'badges_earned' THEN (filtered->'badges_earned') ELSE users.badges_earned END,
      profile_visible_in_echoes = CASE WHEN filtered ? 'profile_visible_in_echoes' THEN (filtered->>'profile_visible_in_echoes')::boolean ELSE users.profile_visible_in_echoes END,
      updated_at               = now();
  -- is_supporter and supporter_since are NEVER modified by this function
END;
$$;


-- ─────────────────────────────────────────────────────────────────────────
-- 3. ECHO AUTHOR PROFILE RPC (privacy-safe, opt-in only)
-- ─────────────────────────────────────────────────────────────────────────
-- Returns profile data ONLY if the author has opted in.
-- Used by MiniProfileCard in echo interactions.

CREATE OR REPLACE FUNCTION public.get_echo_author_profile(author_id uuid)
RETURNS TABLE(
  name text,
  avatar_url text,
  equipped_title_id text,
  current_level int,
  profile_visible boolean
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    u.name,
    u.avatar_url,
    u.equipped_title_id,
    u.current_level,
    u.profile_visible_in_echoes as profile_visible
  FROM public.users u
  WHERE u.id = author_id
    AND u.profile_visible_in_echoes = true;
$$;


-- ─────────────────────────────────────────────────────────────────────────
-- 3b. PROGRESSION RPC: SEPARATE FROM COSMETICS
-- ─────────────────────────────────────────────────────────────────────────
-- Handles progression data (XP, streaks, grace days) in its own RPC.
-- Still uses auth.uid() to prevent impersonation.

CREATE OR REPLACE FUNCTION public.update_profile_progression(
  p_total_xp int DEFAULT NULL,
  p_current_streak int DEFAULT NULL,
  p_longest_streak int DEFAULT NULL,
  p_grace_days int DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.users SET
    total_xp       = COALESCE(p_total_xp, total_xp),
    current_streak = COALESCE(p_current_streak, current_streak),
    longest_streak = COALESCE(p_longest_streak, longest_streak),
    grace_days     = COALESCE(p_grace_days, grace_days),
    -- Derive current_level from total_xp for echo mini-cards
    current_level  = CASE
      WHEN COALESCE(p_total_xp, total_xp) >= 5000 THEN 10
      WHEN COALESCE(p_total_xp, total_xp) >= 4000 THEN 9
      WHEN COALESCE(p_total_xp, total_xp) >= 3000 THEN 8
      WHEN COALESCE(p_total_xp, total_xp) >= 2200 THEN 7
      WHEN COALESCE(p_total_xp, total_xp) >= 1600 THEN 6
      WHEN COALESCE(p_total_xp, total_xp) >= 1100 THEN 5
      WHEN COALESCE(p_total_xp, total_xp) >= 700 THEN 4
      WHEN COALESCE(p_total_xp, total_xp) >= 400 THEN 3
      WHEN COALESCE(p_total_xp, total_xp) >= 150 THEN 2
      ELSE 1
    END,
    updated_at     = now()
  WHERE id = auth.uid();
END;
$$;


-- ─────────────────────────────────────────────────────────────────────────
-- 4. SUPABASE STORAGE: AVATARS BUCKET
-- ─────────────────────────────────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT DO NOTHING;

-- Authenticated users can upload their own avatar (folder = their user ID)
CREATE POLICY "avatar_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Authenticated users can update their own avatar
CREATE POLICY "avatar_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Everyone can read avatars (public bucket)
CREATE POLICY "avatar_read_authenticated" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'avatars');

CREATE POLICY "avatar_read_anon" ON storage.objects
  FOR SELECT TO anon
  USING (bucket_id = 'avatars');
