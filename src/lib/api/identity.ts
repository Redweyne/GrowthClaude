import { getRequiredSupabaseClient } from './client';

export type IdentityStatementRow = {
  id?: string;
  user_id: string;
  created_at?: string;
  statement: string;
  context?: unknown;
  tags?: string[];
  triggered_by_lesson_id?: string | null;
  world_slug?: string | null;
};

export async function listIdentityStatements(userId: string): Promise<IdentityStatementRow[]> {
  const client = getRequiredSupabaseClient();
  const { data, error } = await client
    .from('identity_statements')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as IdentityStatementRow[];
}

export async function createIdentityStatement(row: IdentityStatementRow): Promise<IdentityStatementRow> {
  const client = getRequiredSupabaseClient();
  const { data, error } = await client.from('identity_statements').insert(row).select('*').single();

  if (error) {
    throw error;
  }

  return data as IdentityStatementRow;
}
