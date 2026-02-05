// ═══════════════════════════════════════════════════════════════════════════
// SPARK - MOTIVATIONAL SHORTS FEED
// ═══════════════════════════════════════════════════════════════════════════
//
// Your daily reward: an endless stream of wisdom and motivation.
// But watching isn't growing — we'll remind you when it's time to stop and act.
//
// ═══════════════════════════════════════════════════════════════════════════

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
    | 'wisdom_break_shown'
    | 'wisdom_break_leave'
    | 'wisdom_break_continue'
    | 'session_start'
    | 'session_end'
    | 'spark_unlocked';
  videoId?: string;
  category?: SparkCategory;
  sessionVideoCount?: number;
  timestamp: string;
}

export const SPARK_CATEGORY_INFO: Record<SparkCategory, { label: string; emoji: string; description: string }> = {
  discipline: { label: 'Discipline', emoji: '🔥', description: 'Build unbreakable habits' },
  calm: { label: 'Calm', emoji: '🧘', description: 'Find inner peace' },
  resilience: { label: 'Resilience', emoji: '💪', description: 'Bounce back stronger' },
  gratitude: { label: 'Gratitude', emoji: '🙏', description: 'Shift your perspective' },
  mindset: { label: 'Mindset', emoji: '🧠', description: 'Rewire your thinking' },
  focus: { label: 'Focus', emoji: '🎯', description: 'Sharpen your attention' },
};

export const SPARK_XP_REWARDS = {
  firstSession: 20,
  wisdomBreakLeave: 10,
  videoWatched: 1,
} as const;

export const WISDOM_BREAK_CONFIG = {
  firstSessionThreshold: 7,
  normalThreshold: 12,
  maxBreaksPerDay: 3,
  maxDailyVideoXp: 12,
} as const;

// Wisdom break messages — rotated to stay fresh
export const WISDOM_BREAK_MESSAGES = [
  {
    title: 'Wisdom Break',
    message: 'Motivation without action is just entertainment.',
    prompt: "What's ONE thing you can do right now to move forward?",
  },
  {
    title: 'Pause & Reflect',
    message: 'You\'ve absorbed enough sparks. Now it\'s time to become one.',
    prompt: 'Which idea resonated most? How will you act on it today?',
  },
  {
    title: 'Time to Move',
    message: 'The Stoics didn\'t just read philosophy. They lived it.',
    prompt: 'What small action can you take in the next 10 minutes?',
  },
  {
    title: 'Action Check',
    message: 'Knowledge without practice is merely philosophy. Practice without knowledge is merely activity.',
    prompt: 'Are you ready to turn today\'s spark into a flame?',
  },
] as const;
