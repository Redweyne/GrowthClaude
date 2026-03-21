// ═══════════════════════════════════════════════════════════════════════════
// THE AGORA — Types for the community feedback board
// ═══════════════════════════════════════════════════════════════════════════

export type AgoraCategory = 'idea' | 'bug' | 'love' | 'question';
export type AgoraStatus = 'open' | 'heard' | 'in_progress' | 'done';

export interface AgoraPost {
  id: string;
  userId: string;
  content: string;
  category: AgoraCategory;
  status: AgoraStatus;
  voteCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AgoraPostRow {
  id: string;
  user_id: string;
  content: string;
  category: AgoraCategory;
  status: AgoraStatus;
  vote_count: number;
  created_at: string;
  updated_at: string;
}

export function mapRowToPost(row: AgoraPostRow): AgoraPost {
  return {
    id: row.id,
    userId: row.user_id,
    content: row.content,
    category: row.category,
    status: row.status,
    voteCount: row.vote_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
