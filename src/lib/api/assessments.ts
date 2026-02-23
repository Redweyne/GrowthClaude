import { getRequiredSupabaseClient } from './client';

export type MonthlyAssessmentRow = {
  id?: string;
  user_id: string;
  created_at?: string;
  month: string;
  emotional_mastery: number;
  discipline: number;
  perspective: number;
  self_awareness: number;
  growth: number;
  reflection?: string | null;
  xp_earned?: number;
};

export async function listMonthlyAssessments(userId: string): Promise<MonthlyAssessmentRow[]> {
  const client = getRequiredSupabaseClient();
  const { data, error } = await client
    .from('monthly_assessments')
    .select('*')
    .eq('user_id', userId)
    .order('month', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as MonthlyAssessmentRow[];
}

export async function upsertMonthlyAssessment(row: MonthlyAssessmentRow): Promise<MonthlyAssessmentRow> {
  const client = getRequiredSupabaseClient();
  const { data, error } = await client
    .from('monthly_assessments')
    .upsert(row, { onConflict: 'user_id,month' })
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data as MonthlyAssessmentRow;
}
