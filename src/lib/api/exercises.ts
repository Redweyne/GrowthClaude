import { getRequiredSupabaseClient } from './client';

export type ExerciseCompletionRow = {
  id?: string;
  user_id: string;
  lesson_id: string;
  exercise_id: string;
  score?: number;
  completed_at?: string;
};

export async function listCompletedExercises(userId: string): Promise<ExerciseCompletionRow[]> {
  const client = getRequiredSupabaseClient();
  const { data, error } = await client
    .from('exercises_completed')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as ExerciseCompletionRow[];
}

export async function upsertExerciseCompletion(payload: ExerciseCompletionRow): Promise<ExerciseCompletionRow> {
  const client = getRequiredSupabaseClient();
  const { data, error } = await client.from('exercises_completed').upsert(payload).select('*').single();

  if (error) {
    throw error;
  }

  return data as ExerciseCompletionRow;
}
