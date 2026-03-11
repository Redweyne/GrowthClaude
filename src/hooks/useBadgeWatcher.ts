'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { checkForNewBadges, type BadgeCheckContext } from '@/lib/badgeEngine';
import { getLevelFromXp } from '@/types';

/**
 * Watches store state for badge-eligible changes.
 * When new badges are earned, calls store.earnBadge() at the exact moment
 * the condition is met — ensuring accurate earnedAt timestamps.
 *
 * This hook should be mounted once at the app level.
 */
export function useBadgeWatcher(completedWorldSlugs: string[], totalEchoesSent: number) {
  const prevCtxRef = useRef<string>('');

  const {
    longestStreak,
    currentStreak,
    completedLessons,
    identityStatements,
    isSupporter,
    totalXp,
    badgesEarned,
    earnBadge,
  } = useStore();

  const level = getLevelFromXp(totalXp).level;

  useEffect(() => {
    const ctx: BadgeCheckContext = {
      longestStreak,
      currentStreak,
      totalLessonsCompleted: Object.keys(completedLessons).length,
      totalEchoesSent,
      identityStatementCount: identityStatements.length,
      completedWorldSlugs,
      level,
      isSupporter,
    };

    // Skip if context hasn't changed (prevent unnecessary checks)
    const ctxKey = JSON.stringify(ctx);
    if (ctxKey === prevCtxRef.current) return;
    prevCtxRef.current = ctxKey;

    const newBadgeIds = checkForNewBadges(ctx, badgesEarned);
    for (const badgeId of newBadgeIds) {
      earnBadge(badgeId);
    }
  }, [
    longestStreak, currentStreak, completedLessons, identityStatements,
    isSupporter, totalXp, badgesEarned, totalEchoesSent, completedWorldSlugs,
    level, earnBadge,
  ]);
}
