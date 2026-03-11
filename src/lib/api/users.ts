import { getRequiredSupabaseClient } from './client';
import type { BadgeEarnedRecord } from '@/types/profile';

export type UserProfile = {
  id: string;
  email?: string | null;
  name?: string | null;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
  transformation_goal?: string | null;
  why_statement?: string | null;
  daily_commitment_minutes?: number;
  total_xp?: number;
  current_level?: number;
  current_streak?: number;
  longest_streak?: number;
  grace_days?: number;
  last_lesson_at?: string | null;
  notifications_enabled?: boolean;
  sound_enabled?: boolean;
  haptic_enabled?: boolean;
  onboarding_complete?: boolean;
  language?: string | null;
  community_identity?: string | null;
  last_checkin_date?: string | null;
  last_assessment_month?: string | null;
  // Profile identity
  motto?: string | null;
  accent_color?: string | null;
  banner_key?: string | null;
  equipped_title_id?: string | null;
  badges_earned?: BadgeEarnedRecord[];
  profile_visible_in_echoes?: boolean;
  // Server-owned (read-only from client)
  is_supporter?: boolean;
  supporter_since?: string | null;
};

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const client = getRequiredSupabaseClient();
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await client.from('users').select('*').eq('id', user.id).maybeSingle();
  if (error) {
    throw error;
  }

  return (data as UserProfile | null) ?? null;
}

/**
 * Updates the current user's profile via the whitelist RPC.
 * The RPC only accepts known safe columns — is_supporter, supporter_since
 * are never writable by the client.
 */
export async function upsertCurrentUserProfile(profile: Partial<UserProfile>): Promise<void> {
  const client = getRequiredSupabaseClient();
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    throw new Error('User must be authenticated before updating profile.');
  }

  // Strip read-only and metadata fields before sending to RPC
  const { id: _id, email: _email, created_at: _ca, updated_at: _ua,
          is_supporter: _is, supporter_since: _ss, current_level: _cl,
          notifications_enabled: _ne, ...safeFields } = profile;

  const { error } = await client.rpc('update_profile_safe', { fields: safeFields });
  if (error) {
    throw error;
  }
}

/**
 * Updates progression fields via a separate RPC.
 * Separated from profile cosmetics to enforce concern boundaries.
 * The server also derives current_level from total_xp for echo mini-cards.
 */
export async function syncProgression(progression: {
  total_xp: number;
  current_streak: number;
  longest_streak: number;
  grace_days: number;
}): Promise<void> {
  const client = getRequiredSupabaseClient();
  const { error } = await client.rpc('update_profile_progression', {
    p_total_xp: progression.total_xp,
    p_current_streak: progression.current_streak,
    p_longest_streak: progression.longest_streak,
    p_grace_days: progression.grace_days,
  });
  if (error) {
    throw error;
  }
}
