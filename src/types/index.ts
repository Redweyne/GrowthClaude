// Re-export Daily Practice types
export * from './dailyPractice';

// Transformation Goals
export type TransformationGoal =
  | 'calmer'
  | 'disciplined'
  | 'confident'
  | 'leader'
  | 'focused'
  | 'resilient';

export interface TransformationGoalOption {
  id: TransformationGoal;
  title: string;
  description: string;
  icon: string;
}

export const TRANSFORMATION_GOALS: TransformationGoalOption[] = [
  {
    id: 'calmer',
    title: 'Become Calmer',
    description: 'Master your emotions and find inner peace',
    icon: '🧘',
  },
  {
    id: 'disciplined',
    title: 'Build Discipline',
    description: 'Develop unshakeable self-control and consistency',
    icon: '⚔️',
  },
  {
    id: 'confident',
    title: 'Grow Confident',
    description: 'Trust yourself and act with certainty',
    icon: '🦁',
  },
  {
    id: 'leader',
    title: 'Become a Leader',
    description: 'Inspire others and take responsibility',
    icon: '👑',
  },
  {
    id: 'focused',
    title: 'Sharpen Focus',
    description: 'Eliminate distractions and do deep work',
    icon: '🎯',
  },
  {
    id: 'resilient',
    title: 'Build Resilience',
    description: 'Bounce back stronger from any setback',
    icon: '🔥',
  },
];

// Daily Commitment Options
export interface DailyCommitment {
  minutes: number;
  label: string;
  description: string;
}

export const DAILY_COMMITMENTS: DailyCommitment[] = [
  { minutes: 5, label: '5 min', description: 'Just start' },
  { minutes: 10, label: '10 min', description: 'Recommended' },
  { minutes: 15, label: '15 min', description: 'Go deeper' },
  { minutes: 20, label: '20 min', description: 'Transform' },
];

// Lesson Types
export type ActionType = 'write' | 'reflect' | 'observe' | 'breathe' | 'act';

export interface Lesson {
  id: string;
  slug: string;
  order: number;
  title: string;
  wisdomText: string;
  wisdomSource?: string;
  actionPrompt: string;
  actionType: ActionType;
  actionDurationSeconds: number;
  reflectionPrompt: string;
  mentorResponses: string[];
  xpReward: number;
  coreConceptTag: string;
}

export interface Chapter {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  order: number;
  iconName: string;
  lessons: Lesson[];
}

export interface World {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  iconName: string;
  color: string;
  order: number;
  isPremium: boolean;
  estimatedDays: number;
  totalLessons: number;
  chapters: Chapter[];
}

// Generic display type for home screen - works with both legacy World and FlexibleWorld
export interface DisplayWorld {
  name: string;
  subtitle?: string;
  color: string;
  chapters: Array<{
    lessons: Array<{ id: string }>;
  }>;
}

// Display lesson for home screen - minimum required for LessonCard
export interface DisplayLesson {
  id: string;
  title: string;
  wisdomText?: string;
  xpReward: number;
  actionDurationSeconds?: number;
}

// User Progress
export interface UserProgress {
  lessonId: string;
  completed: boolean;
  completedAt?: Date;
  xpEarned: number;
  masteryLevel: number;
}

// Mentor
export interface MentorMessage {
  text: string;
  type: 'encouragement' | 'wisdom' | 'challenge' | 'celebration';
}

// Level System
export interface Level {
  level: number;
  title: string;
  minXp: number;
  maxXp: number;
}

export const LEVELS: Level[] = [
  { level: 1, title: 'Awakening', minXp: 0, maxXp: 100 },
  { level: 2, title: 'Seeker', minXp: 100, maxXp: 250 },
  { level: 3, title: 'Apprentice', minXp: 250, maxXp: 500 },
  { level: 4, title: 'Practitioner', minXp: 500, maxXp: 850 },
  { level: 5, title: 'Adept', minXp: 850, maxXp: 1300 },
  { level: 6, title: 'Journeyman', minXp: 1300, maxXp: 1900 },
  { level: 7, title: 'Master', minXp: 1900, maxXp: 2700 },
  { level: 8, title: 'Sage', minXp: 2700, maxXp: 3800 },
  { level: 9, title: 'Elder', minXp: 3800, maxXp: 5200 },
  { level: 10, title: 'Enlightened', minXp: 5200, maxXp: Infinity },
];

export function getLevelFromXp(xp: number): Level {
  return LEVELS.find(l => xp >= l.minXp && xp < l.maxXp) || LEVELS[LEVELS.length - 1];
}

export function getXpProgress(xp: number): { current: number; needed: number; percentage: number } {
  const level = getLevelFromXp(xp);
  const current = xp - level.minXp;
  const needed = level.maxXp - level.minXp;
  const percentage = Math.min((current / needed) * 100, 100);
  return { current, needed, percentage };
}
