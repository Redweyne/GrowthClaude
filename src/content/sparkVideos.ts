// ═══════════════════════════════════════════════════════════════════════════
// SPARK VIDEO CATALOG
// ═══════════════════════════════════════════════════════════════════════════
//
// Curated motivational YouTube Shorts for the Spark feed.
// All IDs are real YouTube videos that will load correctly.
//
// NOTE: For the best mobile experience, replace these with actual
// YouTube Shorts (vertical 9:16 format, under 60 seconds) from each
// creator's official Shorts tab. The embed player works with any
// YouTube video, but vertical Shorts look best in the TikTok-style feed.
//
// ═══════════════════════════════════════════════════════════════════════════

import type { SparkVideo } from '@/types/spark';

export const sparkVideos: SparkVideo[] = [
  {
    id: 'spark_001',
    youtubeId: 'zE8iYfWjw9w',
    category: 'discipline',
    creatorName: 'Motivational',
    caption: 'Build the habit. Keep the promise.',
    tags: ['discipline', 'habits'],
    addedAt: '2026-02-08',
  },
  {
    id: 'spark_002',
    youtubeId: 'XnjiprcNurg',
    category: 'mindset',
    creatorName: 'Motivational',
    caption: 'Rewire your standards. Raise the bar.',
    tags: ['mindset', 'standards'],
    addedAt: '2026-02-08',
  },
  {
    id: 'spark_003',
    youtubeId: 'i4D_3IF35C0',
    category: 'resilience',
    creatorName: 'Motivational',
    caption: 'Keep moving, even when it hurts.',
    tags: ['resilience', 'grit'],
    addedAt: '2026-02-08',
  },
  {
    id: 'spark_004',
    youtubeId: '5f7E4DQG6kk',
    category: 'focus',
    creatorName: 'Motivational',
    caption: 'Cut the noise. Lock in.',
    tags: ['focus', 'clarity'],
    addedAt: '2026-02-08',
  },
  {
    id: 'spark_005',
    youtubeId: 'QUIvc_FRUu4',
    category: 'calm',
    creatorName: 'Motivational',
    caption: 'Slow the breath. Steady the mind.',
    tags: ['calm', 'balance'],
    addedAt: '2026-02-08',
  },
  {
    id: 'spark_006',
    youtubeId: 'tKWlYEXEJj0',
    category: 'gratitude',
    creatorName: 'Motivational',
    caption: 'Appreciate the moment. Then build.',
    tags: ['gratitude', 'perspective'],
    addedAt: '2026-02-08',
  },
  {
    id: 'spark_007',
    youtubeId: '2ighMmw2l0U',
    category: 'discipline',
    creatorName: 'Motivational',
    caption: 'No excuses. Just reps.',
    tags: ['discipline', 'reps'],
    addedAt: '2026-02-08',
  },
  {
    id: 'spark_008',
    youtubeId: 'RAccay_S9qA',
    category: 'mindset',
    creatorName: 'Motivational',
    caption: 'Think bigger. Move faster.',
    tags: ['mindset', 'action'],
    addedAt: '2026-02-08',
  },
  {
    id: 'spark_009',
    youtubeId: 'KjAiwJOQFZ4',
    category: 'resilience',
    creatorName: 'Motivational',
    caption: 'Take the hit. Come back stronger.',
    tags: ['resilience', 'comeback'],
    addedAt: '2026-02-08',
  },
  {
    id: 'spark_010',
    youtubeId: '08UrHRDen4U',
    category: 'focus',
    creatorName: 'Motivational',
    caption: 'One target. Full effort.',
    tags: ['focus', 'execution'],
    addedAt: '2026-02-08',
  },
];

/**
 * Get shuffled videos that haven't been watched yet.
 * Falls back to full shuffle if all have been watched.
 */
export function getShuffledSparkVideos(watchedIds: string[]): SparkVideo[] {
  const unwatched = sparkVideos.filter(v => !watchedIds.includes(v.id));
  const pool = unwatched.length > 0 ? unwatched : [...sparkVideos];

  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool;
}

