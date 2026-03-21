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
    | 'spark_unlocked'
    | 'video_error';
  videoId?: string;
  category?: SparkCategory;
  sessionVideoCount?: number;
  timestamp: string;
}

export const SPARK_CATEGORY_INFO: Record<SparkCategory, { label: string; emoji: string; description: string }> = {
  discipline: { label: 'Discipline', emoji: '\u{1F4AA}', description: 'Build unbreakable habits' },
  calm: { label: 'Calm', emoji: '\u{1F9D8}', description: 'Find inner peace' },
  resilience: { label: 'Resilience', emoji: '\u{1F3D4}\u{FE0F}', description: 'Bounce back stronger' },
  gratitude: { label: 'Gratitude', emoji: '\u{1F64F}', description: 'Shift your perspective' },
  mindset: { label: 'Mindset', emoji: '\u{1F9E0}', description: 'Rewire your thinking' },
  focus: { label: 'Focus', emoji: '\u{1F3AF}', description: 'Sharpen your attention' },
};

export const SPARK_XP_REWARDS = {
  firstSession: 20,
  videoWatched: 1,
} as const;
