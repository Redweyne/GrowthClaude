import { getRequiredSupabaseClient } from './client';
import type { AgoraCategory, AgoraPostRow } from '@/types/agora';

export async function listPosts(
  category?: AgoraCategory | null,
  sort: 'top' | 'new' = 'top',
  limit = 100,
): Promise<AgoraPostRow[]> {
  const client = getRequiredSupabaseClient();
  let query = client.from('agora_posts').select('*');

  if (category) {
    query = query.eq('category', category);
  }

  if (sort === 'top') {
    query = query.order('vote_count', { ascending: false }).order('created_at', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query.limit(limit);
  if (error) throw error;
  return (data ?? []) as AgoraPostRow[];
}

export async function createPost(
  userId: string,
  content: string,
  category: AgoraCategory,
): Promise<AgoraPostRow> {
  const client = getRequiredSupabaseClient();
  const { data, error } = await client
    .from('agora_posts')
    .insert({ user_id: userId, content, category })
    .select('*')
    .single();

  if (error) throw error;
  return data as AgoraPostRow;
}

export async function deletePost(postId: string): Promise<void> {
  const client = getRequiredSupabaseClient();
  const { error } = await client.from('agora_posts').delete().eq('id', postId);
  if (error) throw error;
}

export async function getUserVotes(userId: string): Promise<string[]> {
  const client = getRequiredSupabaseClient();
  const { data, error } = await client
    .from('agora_votes')
    .select('post_id')
    .eq('user_id', userId);

  if (error) throw error;
  return (data ?? []).map((row: { post_id: string }) => row.post_id);
}

export async function votePost(userId: string, postId: string): Promise<void> {
  const client = getRequiredSupabaseClient();
  const { error } = await client
    .from('agora_votes')
    .insert({ user_id: userId, post_id: postId });
  if (error) throw error;
}

export async function unvotePost(userId: string, postId: string): Promise<void> {
  const client = getRequiredSupabaseClient();
  const { error } = await client
    .from('agora_votes')
    .delete()
    .eq('user_id', userId)
    .eq('post_id', postId);
  if (error) throw error;
}
