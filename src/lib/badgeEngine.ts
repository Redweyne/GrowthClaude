import { ALL_BADGES, type BadgeCheckContext, type BadgeDefinition, type BadgeEarnedRecord } from '@/types/profile';
export type { BadgeCheckContext };

/**
 * Check which badges the user is eligible for based on current state.
 * Returns all eligible badge IDs (regardless of whether already earned).
 */
export function getEligibleBadgeIds(ctx: BadgeCheckContext): string[] {
  return ALL_BADGES
    .filter(badge => isBadgeConditionMet(badge, ctx))
    .map(b => b.id);
}

/**
 * Given current state and already-earned badges, returns newly earned badge IDs.
 * Called at mutation points (completeLesson, saveIdentityStatement, echo-send).
 */
export function checkForNewBadges(
  ctx: BadgeCheckContext,
  alreadyEarned: BadgeEarnedRecord[],
): string[] {
  const earnedIds = new Set(alreadyEarned.map(b => b.badgeId));
  return getEligibleBadgeIds(ctx).filter(id => !earnedIds.has(id));
}

/**
 * Build a BadgeCheckContext from store state fields.
 * This avoids importing the full store in this module.
 */
export function buildBadgeContext(state: {
  longestStreak: number;
  currentStreak: number;
  completedLessons: Record<string, boolean>;
  identityStatements: { id: string }[];
  isSupporter: boolean;
  totalXp: number;
}, completedWorldSlugs: string[], totalEchoesSent: number, level: number): BadgeCheckContext {
  return {
    longestStreak: state.longestStreak,
    currentStreak: state.currentStreak,
    totalLessonsCompleted: Object.keys(state.completedLessons).length,
    totalEchoesSent,
    identityStatementCount: state.identityStatements.length,
    completedWorldSlugs,
    level,
    isSupporter: state.isSupporter,
  };
}

function isBadgeConditionMet(badge: BadgeDefinition, ctx: BadgeCheckContext): boolean {
  switch (badge.id) {
    case 'first-flame':
      return ctx.longestStreak >= 1;
    case 'week-warrior':
      return ctx.longestStreak >= 7;
    case 'iron-will':
      return ctx.longestStreak >= 30;
    case 'century':
      return ctx.longestStreak >= 100;
    case 'world-walker':
      return ctx.completedWorldSlugs.length >= 1;
    case 'echo-sender':
      return ctx.totalEchoesSent >= 10;
    case 'deep-diver':
      return ctx.totalLessonsCompleted >= 15;
    case 'identity-forger':
      return ctx.identityStatementCount >= 3;
    case 'philosopher-king':
      return ctx.level >= 10;
    case 'founding-member':
      return ctx.isSupporter;
    default:
      return false;
  }
}

/**
 * Get a badge definition by ID.
 */
export function getBadgeById(id: string): BadgeDefinition | undefined {
  return ALL_BADGES.find(b => b.id === id);
}

/**
 * Get full badge status for display: definition + earned state.
 */
export function getBadgeDisplayList(
  ctx: BadgeCheckContext,
  earned: BadgeEarnedRecord[],
): Array<{ badge: BadgeDefinition; isEarned: boolean; earnedAt: string | null }> {
  const earnedMap = new Map(earned.map(e => [e.badgeId, e.earnedAt]));
  return ALL_BADGES.map(badge => ({
    badge,
    isEarned: earnedMap.has(badge.id) || isBadgeConditionMet(badge, ctx),
    earnedAt: earnedMap.get(badge.id) ?? null,
  }));
}
