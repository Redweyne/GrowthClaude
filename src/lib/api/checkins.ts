import { getRequiredSupabaseClient } from './client';

export type WeeklyCheckinRow = {
  id?: string;
  user_id: string;
  created_at?: string;
  week_of: string;
  responses?: unknown[];
  xp_earned?: number;
  awareness_rating?: number | null;
  action_rating?: number | null;
  progress_feeling?: number | null;
  biggest_win?: string | null;
  biggest_challenge?: string | null;
  next_week_intention?: string | null;
};

export async function listWeeklyCheckins(userId: string): Promise<WeeklyCheckinRow[]> {
  const client = getRequiredSupabaseClient();
  const { data, error } = await client
    .from('weekly_checkins')
    .select('*')
    .eq('user_id', userId)
    .order('week_of', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as WeeklyCheckinRow[];
}

export async function upsertWeeklyCheckin(row: WeeklyCheckinRow): Promise<WeeklyCheckinRow> {
  const client = getRequiredSupabaseClient();
  const { data, error } = await client
    .from('weekly_checkins')
    .upsert(row, { onConflict: 'user_id,week_of' })
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data as WeeklyCheckinRow;
}
