import { getRequiredSupabaseClient } from './client';

export type CommunityEchoRow = {
  id?: string;
  user_id: string;
  reflection_id?: string | null;
  lesson_id?: string | null;
  lesson_title?: string | null;
  author_gender?: 'brother' | 'sister' | 'traveler' | null;
  content: string;
  is_open_to_connect?: boolean;
  created_at?: string;
};

export type EchoResponseRow = {
  id?: string;
  user_id: string;
  echo_id: string;
  content: string;
  responder_gender?: 'brother' | 'sister' | 'traveler' | null;
  is_open_to_connect?: boolean;
  created_at?: string;
};

export type EchoResponseWithEchoOwnerRow = EchoResponseRow & {
  community_echoes?: {
    user_id?: string;
  } | null;
};

export async function listCommunityEchoes(limit = 50): Promise<CommunityEchoRow[]> {
  const client = getRequiredSupabaseClient();
  const { data, error } = await client
    .from('community_echoes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return (data ?? []) as CommunityEchoRow[];
}

export async function createCommunityEcho(payload: CommunityEchoRow): Promise<CommunityEchoRow> {
  const client = getRequiredSupabaseClient();
  const { data, error } = await client.from('community_echoes').insert(payload).select('*').single();

  if (error) {
    throw error;
  }

  return data as CommunityEchoRow;
}

export async function respondToEcho(payload: EchoResponseRow): Promise<EchoResponseRow> {
  const client = getRequiredSupabaseClient();
  const { data, error } = await client.from('echo_responses').insert(payload).select('*').single();

  if (error) {
    throw error;
  }

  return data as EchoResponseRow;
}

export async function listSentEchoResponses(userId: string): Promise<EchoResponseRow[]> {
  const client = getRequiredSupabaseClient();
  const { data, error } = await client
    .from('echo_responses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as EchoResponseRow[];
}

export async function listReceivedEchoResponses(userId: string): Promise<EchoResponseWithEchoOwnerRow[]> {
  const client = getRequiredSupabaseClient();
  const { data, error } = await client
    .from('echo_responses')
    .select('*, community_echoes!inner(user_id)')
    .eq('community_echoes.user_id', userId)
    .neq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as EchoResponseWithEchoOwnerRow[];
}
