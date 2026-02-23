import { getRequiredSupabaseClient } from './client';

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

export async function upsertCurrentUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
  const client = getRequiredSupabaseClient();
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    throw new Error('User must be authenticated before updating profile.');
  }

  const payload = {
    id: user.id,
    email: user.email ?? null,
    ...profile,
  };

  const { data, error } = await client.from('users').upsert(payload).select('*').single();
  if (error) {
    throw error;
  }

  return data as UserProfile;
}
