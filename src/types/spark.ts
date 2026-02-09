export type SparkCategory =
  | 'discipline'
  | 'calm'
  | 'resilience'
  | 'gratitude'
  | 'mindset'
  | 'focus';

export interface SparkVideo {
  id: string;
  youtubeId: string;
  category: SparkCategory;
  creatorName?: string;
  caption?: string;
  tags?: string[];
  addedAt: string;
}

export interface SparkAnalyticsEvent {
  type:
    | 'video_watched'
    | 'video_skipped'
    | 'video_saved'
    | 'session_start'
    | 'session_end'
    | 'spark_unlocked';
  videoId?: string;
  category?: SparkCategory;
  sessionVideoCount?: number;
  timestamp: string;
}

export const SPARK_CATEGORY_INFO: Record<SparkCategory, { label: string; emoji: string; description: string }> = {
  discipline: { label: 'Discipline', emoji: '??', description: 'Build unbreakable habits' },
  calm: { label: 'Calm', emoji: '??', description: 'Find inner peace' },
  resilience: { label: 'Resilience', emoji: '??', description: 'Bounce back stronger' },
  gratitude: { label: 'Gratitude', emoji: '??', description: 'Shift your perspective' },
  mindset: { label: 'Mindset', emoji: '??', description: 'Rewire your thinking' },
  focus: { label: 'Focus', emoji: '??', description: 'Sharpen your attention' },
};

export const SPARK_XP_REWARDS = {
  firstSession: 20,
  videoWatched: 1,
} as const;
