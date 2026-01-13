'use client';

// ============================================================================
// USE TRANSFORMATION STORY HOOK
// Bridges the store with the story generation system.
// Gathers all user data and generates personalized stories.
// ============================================================================

import { useMemo, useCallback } from 'react';
import { useStore } from '@/store/useStore';
import {
  StoryGenerationContext,
  StoryMetrics,
  TransformationStory,
  StoryType,
  ReflectionForStory,
  IdentityForStory,
  AssessmentForStory,
  WisdomLogForStory,
  AchievementForStory,
  MonthlyPatternForStory
} from '@/types/story';
import { buildTransformationStory } from '@/lib/story';
import { ACHIEVEMENTS } from '@/types/achievements';

export function useTransformationStory() {
  const store = useStore();

  // Check if user has enough data for a story
  const canGenerateStory = useMemo(() => {
    const hasReflections = (store.allReflections?.length || 0) >= 3;
    const hasLessons = Object.keys(store.completedLessons || {}).length >= 1;
    return hasReflections || hasLessons;
  }, [store.allReflections, store.completedLessons]);

  // Get story readiness info
  const storyReadiness = useMemo(() => {
    const reflectionCount = store.allReflections?.length || 0;
    const lessonCount = Object.keys(store.completedLessons || {}).length;
    const hasIdentity = (store.identityStatements?.length || 0) > 0;
    const hasStreak = store.currentStreak >= 3;

    return {
      isReady: canGenerateStory,
      reflectionCount,
      lessonCount,
      hasIdentity,
      hasStreak,
      minimumRequired: {
        reflections: 3,
        current: reflectionCount
      },
      richness: calculateRichness(reflectionCount, lessonCount, hasIdentity, hasStreak)
    };
  }, [canGenerateStory, store]);

  // Build the story generation context from store
  const buildContext = useCallback((): StoryGenerationContext | null => {
    if (!canGenerateStory) return null;

    // Get first activity date
    const allReflections = store.allReflections || [];
    const sortedReflections = [...allReflections].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const firstDate = sortedReflections[0]?.date
      ? new Date(sortedReflections[0].date)
      : new Date();
    const now = new Date();

    // Transform reflections
    const reflections: ReflectionForStory[] = sortedReflections.map(r => ({
      id: r.id,
      text: r.reflection,
      date: r.date,
      lessonTitle: r.lessonTitle,
      coreConceptTag: r.coreConceptTag,
      wordCount: r.reflection.split(/\s+/).length
    }));

    // Transform identity statements
    const identityStatements: IdentityForStory[] = (store.identityStatements || []).map(s => ({
      statement: s.statement,
      date: s.createdAt,
      context: s.context?.description || 'Personal reflection'
    }));

    // Transform assessments
    const assessments: AssessmentForStory[] = (store.monthlyAssessments || []).map(a => ({
      date: a.date,
      month: a.month,
      scores: a.scores
    }));

    // Transform wisdom logs
    const wisdomLogs: WisdomLogForStory[] = (store.wisdomInActionLogs || []).map(w => ({
      situation: w.situation,
      principle: w.stoicPrinciple,
      outcome: w.outcome,
      date: w.date
    }));

    // Transform achievements
    const unlockedIds = new Set((store.unlockedAchievements || []).map(a => a.achievementId));
    const achievements: AchievementForStory[] = ACHIEVEMENTS
      .filter(a => unlockedIds.has(a.id))
      .map(a => {
        const unlock = store.unlockedAchievements?.find(u => u.achievementId === a.id);
        return {
          id: a.id,
          name: a.name,
          icon: a.icon,
          rarity: a.rarity,
          unlockedAt: unlock?.unlockedAt || ''
        };
      });

    // Build pattern history (simplified - using reflection themes)
    const patternHistory = buildPatternHistory(reflections);

    // Calculate metrics
    const daysSinceStart = Math.floor(
      (now.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const totalWordsWritten = reflections.reduce((sum, r) => sum + r.wordCount, 0);
    const totalActiveDays = (store.activityLog || []).length;
    const consistencyPercentage = daysSinceStart > 0
      ? (totalActiveDays / daysSinceStart) * 100
      : 100;

    const metrics: StoryMetrics = {
      totalReflections: reflections.length,
      totalWordsWritten,
      averageReflectionLength: reflections.length > 0
        ? Math.round(totalWordsWritten / reflections.length)
        : 0,
      longestReflection: reflections.length > 0
        ? Math.max(...reflections.map(r => r.wordCount))
        : 0,
      totalActiveDays,
      currentStreak: store.currentStreak,
      longestStreak: store.longestStreak,
      consistencyPercentage,
      lessonsCompleted: Object.keys(store.completedLessons || {}).length,
      practiceSessionsCompleted: 0, // Could track this
      assessmentsCompleted: assessments.length,
      identityStatementsCreated: identityStatements.length,
      wisdomApplications: wisdomLogs.length,
      achievementsUnlocked: achievements.length,
      totalXpEarned: store.totalXp,
      currentLevel: getCurrentLevel(store.totalXp),
      dominantPatterns: getDominantPatterns(patternHistory),
      patternShifts: [],
      daysSinceStart,
      totalTimeInvested: formatTimeInvested(totalActiveDays * 10) // Estimate 10 mins per session
    };

    return {
      userName: store.name || '',
      transformationGoal: store.transformationGoal || 'growth',
      whyStatement: store.whyStatement || '',
      periodStart: firstDate,
      periodEnd: now,
      daysSinceJourneyStart: daysSinceStart,
      reflections,
      identityStatements,
      assessments,
      wisdomLogs,
      achievements,
      patternHistory,
      metrics
    };
  }, [canGenerateStory, store]);

  // Generate a story
  const generateStory = useCallback((type: StoryType = 'on_demand'): TransformationStory | null => {
    const context = buildContext();
    if (!context) return null;

    return buildTransformationStory(context, type);
  }, [buildContext]);

  // Seed demo data for users to experience the story feature
  const seedDemoData = useCallback(() => {
    store.seedDemoData();
    return true;
  }, [store]);

  return {
    canGenerateStory,
    storyReadiness,
    generateStory,
    buildContext,
    seedDemoData
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function calculateRichness(
  reflections: number,
  lessons: number,
  hasIdentity: boolean,
  hasStreak: boolean
): 'minimal' | 'moderate' | 'rich' | 'exceptional' {
  let score = 0;
  if (reflections >= 10) score += 2;
  else if (reflections >= 5) score += 1;
  if (lessons >= 10) score += 2;
  else if (lessons >= 5) score += 1;
  if (hasIdentity) score += 1;
  if (hasStreak) score += 1;

  if (score >= 6) return 'exceptional';
  if (score >= 4) return 'rich';
  if (score >= 2) return 'moderate';
  return 'minimal';
}

function getCurrentLevel(xp: number): number {
  const levels = [
    { level: 1, minXp: 0 },
    { level: 2, minXp: 100 },
    { level: 3, minXp: 250 },
    { level: 4, minXp: 500 },
    { level: 5, minXp: 850 },
    { level: 6, minXp: 1300 },
    { level: 7, minXp: 1900 },
    { level: 8, minXp: 2700 },
    { level: 9, minXp: 3800 },
    { level: 10, minXp: 5200 }
  ];

  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i].minXp) return levels[i].level;
  }
  return 1;
}

function formatTimeInvested(minutes: number): string {
  if (minutes < 60) return `${minutes} minutes`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours`;
  const days = Math.floor(hours / 24);
  return `${days} days`;
}

function buildPatternHistory(reflections: ReflectionForStory[]): MonthlyPatternForStory[] {
  // Group reflections by month
  const monthlyReflections = new Map<string, ReflectionForStory[]>();

  for (const reflection of reflections) {
    const date = new Date(reflection.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!monthlyReflections.has(monthKey)) {
      monthlyReflections.set(monthKey, []);
    }
    monthlyReflections.get(monthKey)!.push(reflection);
  }

  // Pattern keywords (simplified)
  const patterns = {
    control: ['control', 'can\'t control', 'out of control'],
    acceptance: ['accept', 'let go', 'peace with'],
    patience: ['patient', 'patience', 'wait'],
    courage: ['courage', 'brave', 'fear', 'afraid'],
    gratitude: ['grateful', 'thankful', 'appreciate'],
    perspective: ['perspective', 'realize', 'understand'],
    growth: ['grow', 'growth', 'learn', 'improve'],
    discipline: ['discipline', 'habit', 'routine', 'consistent']
  };

  const result: MonthlyPatternForStory[] = [];

  for (const [month, monthReflections] of monthlyReflections) {
    const themes: Record<string, number> = {};

    for (const [pattern, keywords] of Object.entries(patterns)) {
      let count = 0;
      for (const reflection of monthReflections) {
        const text = reflection.text.toLowerCase();
        for (const keyword of keywords) {
          if (text.includes(keyword)) {
            count++;
            break;
          }
        }
      }
      themes[pattern] = count;
    }

    result.push({ month, themes });
  }

  return result.sort((a, b) => a.month.localeCompare(b.month));
}

function getDominantPatterns(history: MonthlyPatternForStory[]): string[] {
  if (history.length === 0) return [];

  // Get patterns from the most recent month
  const recent = history[history.length - 1];
  const sorted = Object.entries(recent.themes)
    .sort(([, a], [, b]) => b - a)
    .filter(([, count]) => count > 0)
    .slice(0, 3)
    .map(([pattern]) => pattern);

  return sorted;
}
