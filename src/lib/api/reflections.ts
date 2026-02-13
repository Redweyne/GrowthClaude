import { getRequiredSupabaseClient } from './client';

export type ReflectionRow = {
  id?: string;
  user_id: string;
  lesson_id: string;
  content: string;
  word_count?: number;
  sentiment?: string | null;
  action_honesty?: string | null;
  is_public?: boolean;
  created_at?: string;
};

export async function listReflections(userId: string): Promise<ReflectionRow[]> {
  const client = getRequiredSupabaseClient();
  const { data, error } = await client
    .from('reflections')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as ReflectionRow[];
}

export async function createReflection(reflection: ReflectionRow): Promise<ReflectionRow> {
  const client = getRequiredSupabaseClient();
  const { data, error } = await client.from('reflections').insert(reflection).select('*').single();

  if (error) {
    throw error;
  }

  return data as ReflectionRow;
}
