import { getRequiredSupabaseClient } from './client';

export type LessonProgressRow = {
  id?: string;
  user_id: string;
  lesson_id: string;
  created_at?: string;
  updated_at?: string;
  completed?: boolean;
  completed_at?: string;
  action_completed?: boolean;
  reflection_written?: boolean;
  time_spent_seconds?: number;
  xp_earned?: number;
  last_practiced_at?: string;
  practice_count?: number;
  mastery_level?: number;
};

export async function listLessonProgress(userId: string): Promise<LessonProgressRow[]> {
  const client = getRequiredSupabaseClient();
  const { data, error } = await client
    .from('lesson_progress')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as LessonProgressRow[];
}

export async function upsertLessonProgress(progress: LessonProgressRow): Promise<LessonProgressRow> {
  const client = getRequiredSupabaseClient();
  const { data, error } = await client.from('lesson_progress').upsert(progress).select('*').single();

  if (error) {
    throw error;
  }

  return data as LessonProgressRow;
}

export async function getLatestStreak(userId: string): Promise<number> {
  const client = getRequiredSupabaseClient();
  const { data, error } = await client
    .from('streak_records')
    .select('current_streak')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return 0;
  }

  return Number((data as { current_streak?: number }).current_streak ?? 0);
}
