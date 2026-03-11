import type { TimelineEvent } from '@/types/profile';
import type { BadgeEarnedRecord } from '@/types/profile';
import { getBadgeById } from './badgeEngine';
import { LEVELS } from '@/types';

interface TimelineSourceData {
  completedLessons: Record<string, boolean>;
  identityStatements: Array<{ id: string; statement: string; createdAt: string }>;
  longestStreak: number;
  totalXp: number;
  badgesEarned: BadgeEarnedRecord[];
  weeklyCheckins: Array<{ id: string; date: string }>;
  activityLog: Array<{ date: string; lessonsCompleted: number }>;
}

/**
 * Generate timeline events from existing store data.
 * Fully derived — no separate persistence needed.
 * Returns sorted descending (most recent first).
 */
export function generateTimeline(data: TimelineSourceData): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  // Journey start (earliest activity log entry)
  if (data.activityLog.length > 0) {
    const sorted = [...data.activityLog].sort((a, b) => a.date.localeCompare(b.date));
    events.push({
      id: 'journey-start',
      type: 'journey_start',
      date: sorted[0].date,
      title: 'Journey Began',
      description: 'You took your first step on the path of transformation.',
      icon: 'Sunrise',
    });
  }

  // First lesson
  const totalLessons = Object.keys(data.completedLessons).length;
  if (totalLessons >= 1 && data.activityLog.length > 0) {
    const sorted = [...data.activityLog].sort((a, b) => a.date.localeCompare(b.date));
    const firstLessonDay = sorted.find(a => a.lessonsCompleted > 0);
    if (firstLessonDay) {
      events.push({
        id: 'first-lesson',
        type: 'first_lesson',
        date: firstLessonDay.date,
        title: 'First Lesson Completed',
        description: 'You completed your first lesson.',
        icon: 'BookOpen',
      });
    }
  }

  // Build a map of badge earnedAt dates for cross-referencing
  const badgeEarnedMap = new Map(data.badgesEarned.map(b => [b.badgeId, b.earnedAt]));

  // Streak milestones — use badge earnedAt when available for accuracy
  const streakBadgeMap: Record<number, string> = {
    7: 'week-warrior',
    30: 'iron-will',
    100: 'century',
  };
  const streakMilestones = [7, 14, 21, 30, 60, 90, 100];
  for (const milestone of streakMilestones) {
    if (data.longestStreak >= milestone) {
      const badgeDate = streakBadgeMap[milestone] ? badgeEarnedMap.get(streakBadgeMap[milestone]) : undefined;
      const date = badgeDate || estimateMilestoneDate(data.activityLog, milestone);
      const isEstimated = !badgeDate;
      events.push({
        id: `streak-${milestone}`,
        type: 'streak_milestone',
        date,
        title: `${milestone}-Day Streak`,
        description: `You maintained a ${milestone}-day streak of daily practice.${isEstimated ? ' (approx.)' : ''}`,
        icon: 'Flame',
      });
    }
  }

  // Level ups — use badge earnedAt for level 10 (philosopher-king), estimate others
  for (const level of LEVELS) {
    if (level.level > 1 && data.totalXp >= level.minXp) {
      const levelBadgeDate = level.level >= 10 ? badgeEarnedMap.get('philosopher-king') : undefined;
      const date = levelBadgeDate || estimateLevelUpDate(data.activityLog, data.totalXp, level.minXp);
      const isEstimated = !levelBadgeDate;
      events.push({
        id: `level-${level.level}`,
        type: 'level_up',
        date,
        title: `Reached Level ${level.level}: ${level.title}`,
        description: `You advanced to ${level.title} with ${level.minXp} XP.${isEstimated ? ' (approx.)' : ''}`,
        icon: 'Star',
      });
    }
  }

  // Identity statement changes
  for (const stmt of data.identityStatements) {
    events.push({
      id: `identity-${stmt.id}`,
      type: 'identity_change',
      date: stmt.createdAt,
      title: 'Identity Statement',
      description: stmt.statement,
      icon: 'Fingerprint',
    });
  }

  // Badge unlocks
  for (const earned of data.badgesEarned) {
    const badge = getBadgeById(earned.badgeId);
    if (badge) {
      events.push({
        id: `badge-${earned.badgeId}`,
        type: 'badge_unlock',
        date: earned.earnedAt,
        title: `Badge Unlocked: ${badge.name}`,
        description: badge.description,
        icon: badge.icon,
      });
    }
  }

  // First weekly check-in
  if (data.weeklyCheckins.length > 0) {
    const sorted = [...data.weeklyCheckins].sort((a, b) => a.date.localeCompare(b.date));
    events.push({
      id: 'first-checkin',
      type: 'first_checkin',
      date: sorted[0].date,
      title: 'First Weekly Check-in',
      description: 'You reflected on your first week of practice.',
      icon: 'Calendar',
    });
  }

  // Sort by date descending (most recent first)
  events.sort((a, b) => b.date.localeCompare(a.date));

  return events;
}

/**
 * Estimate the date a streak milestone was reached based on activity log.
 * If we can't determine precisely, use best approximation.
 */
function estimateMilestoneDate(activityLog: Array<{ date: string }>, daysNeeded: number): string {
  if (activityLog.length === 0) return new Date().toISOString();
  const sorted = [...activityLog].sort((a, b) => a.date.localeCompare(b.date));
  // The milestone was reached on approximately the Nth consecutive day
  const targetIndex = Math.min(daysNeeded - 1, sorted.length - 1);
  return sorted[targetIndex]?.date ?? sorted[sorted.length - 1].date;
}

/**
 * Estimate when a level-up XP threshold was crossed.
 */
function estimateLevelUpDate(
  activityLog: Array<{ date: string; xpEarned?: number }>,
  _totalXp: number,
  _thresholdXp: number,
): string {
  // Without cumulative XP tracking per day, estimate based on activity proportion
  if (activityLog.length === 0) return new Date().toISOString();
  const sorted = [...activityLog].sort((a, b) => a.date.localeCompare(b.date));
  // Use midpoint as rough estimate
  const midIndex = Math.floor(sorted.length / 2);
  return sorted[midIndex]?.date ?? sorted[sorted.length - 1].date;
}
