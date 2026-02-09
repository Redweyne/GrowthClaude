import type { SparkVideo } from '@/types/spark';

// Spark video catalog.
// Keep exactly 10 IDs here until the feed content system is expanded.
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

export function getShuffledSparkVideos(watchedIds: string[]): SparkVideo[] {
  const unwatched = sparkVideos.filter((video) => !watchedIds.includes(video.id));
  const pool = unwatched.length > 0 ? [...unwatched] : [...sparkVideos];

  for (let index = pool.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [pool[index], pool[randomIndex]] = [pool[randomIndex], pool[index]];
  }

  return pool;
}
