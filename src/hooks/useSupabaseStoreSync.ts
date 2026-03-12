'use client';

import { useEffect, useRef } from 'react';
import type { TransformationGoal } from '@/types';
import type { IdentityContext, IdentityStatement } from '@/types/identity';
import type { EchoResponse, PublicReflection } from '@/types/echoes';
import { useAuth } from '@/hooks/useAuth';
import {
  getCurrentUserProfile,
  upsertCurrentUserProfile,
  syncProgression,
  listLessonProgress,
  upsertLessonProgress,
  listReflections,
  createReflection,
  listWeeklyCheckins,
  upsertWeeklyCheckin,
  listMonthlyAssessments,
  upsertMonthlyAssessment,
  listIdentityStatements,
  createIdentityStatement,
  listCommunityEchoes,
  createCommunityEcho,
  listSentEchoResponses,
  listReceivedEchoResponses,
  respondToEcho,
} from '@/lib/api';
import { useStore, type ReflectionEntry, type MonthlyAssessment } from '@/store/useStore';
import { useEchoesStore } from '@/store/useEchoesStore';

type StoreState = ReturnType<typeof useStore.getState>;
type EchoesState = ReturnType<typeof useEchoesStore.getState>;

type CheckinResponseData = {
  promptId: string;
  mainResponse: string;
  followUpResponse?: string;
};

type WeeklyCheckinData = {
  id: string;
  date: string;
  weekNumber: number;
  responses: CheckinResponseData[];
  xpEarned: number;
};

const PROFILE_SYNC_DEBOUNCE_MS = 500;

const VALID_TRANSFORMATION_GOALS: TransformationGoal[] = [
  'calmer',
  'disciplined',
  'confident',
  'leader',
  'focused',
  'resilient',
];

const VALID_LANGUAGES: Array<StoreState['language']> = ['en', 'fr', 'ar'];
const VALID_ACCENT_COLORS: Array<StoreState['accentColor']> = ['gold', 'rose', 'purple', 'emerald', 'indigo'];
const VALID_FRAME_IDS: Array<NonNullable<StoreState['equippedFrameId']>> = ['bronze', 'silver', 'gold', 'platinum', 'diamond', 'founder', 'aurora', 'inferno', 'void', 'celestial', 'sakura'];
const VALID_COMMUNITY_IDENTITIES: Array<NonNullable<StoreState['communityIdentity']>> = [
  'brother',
  'sister',
  'traveler',
];
const VALID_GENDERS = ['brother', 'sister', 'traveler'] as const;
type GenderIdentity = (typeof VALID_GENDERS)[number];

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function countWords(value: string): number {
  const trimmed = value.trim();
  if (!trimmed) {
    return 0;
  }
  return trimmed.split(/\s+/).length;
}

function toIsoDate(value: string): string {
  if (!value) {
    return new Date().toISOString().split('T')[0];
  }

  if (value.includes('T')) {
    return value.split('T')[0];
  }

  return value;
}

function getWeekNumber(dateInput: string): number {
  const date = new Date(dateInput);
  const firstJan = new Date(date.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((date.getTime() - firstJan.getTime()) / 86400000) + 1;
  return Math.ceil((dayOfYear + firstJan.getDay()) / 7);
}

function isIdentityContext(value: unknown): value is IdentityContext {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.type === 'string' &&
    ['milestone', 'lesson', 'reflection', 'manual'].includes(candidate.type) &&
    typeof candidate.trigger === 'string' &&
    typeof candidate.description === 'string'
  );
}

function normalizeGender(value?: string | null): GenderIdentity {
  if (value && VALID_GENDERS.includes(value as GenderIdentity)) {
    return value as GenderIdentity;
  }
  return 'traveler';
}

function profilePayloadFromStore(state: StoreState) {
  return {
    name: state.name,
    avatar_url: state.avatarUrl,
    transformation_goal: state.transformationGoal,
    why_statement: state.whyStatement,
    daily_commitment_minutes: state.dailyCommitmentMinutes,
    // Progression fields (total_xp, current_streak, longest_streak, grace_days)
    // are synced via the separate update_profile_progression RPC.
    last_lesson_at: state.lastLessonDate ? new Date(state.lastLessonDate).toISOString() : null,
    sound_enabled: state.soundEnabled,
    haptic_enabled: state.hapticEnabled,
    onboarding_complete: state.onboardingComplete,
    language: state.language,
    community_identity: state.communityIdentity,
    last_checkin_date: state.lastCheckinDate,
    last_assessment_month: state.lastAssessmentMonth,
    // Profile identity fields
    motto: state.motto,
    accent_color: state.accentColor,
    banner_key: state.bannerKey,
    equipped_title_id: state.equippedTitleId,
    badges_earned: state.badgesEarned,
    profile_visible_in_echoes: state.profileVisibleInEchoes,
    equipped_frame_id: state.equippedFrameId,
    featured_badge_id: state.featuredBadgeId,
    // NEVER include: is_supporter, supporter_since
  };
}

function progressionFieldsChanged(prev: StoreState, next: StoreState): boolean {
  return (
    prev.totalXp !== next.totalXp ||
    prev.currentStreak !== next.currentStreak ||
    prev.longestStreak !== next.longestStreak ||
    prev.graceDays !== next.graceDays
  );
}

function profileFieldsChanged(prev: StoreState, next: StoreState): boolean {
  return (
    prev.name !== next.name ||
    prev.avatarUrl !== next.avatarUrl ||
    prev.transformationGoal !== next.transformationGoal ||
    prev.whyStatement !== next.whyStatement ||
    prev.dailyCommitmentMinutes !== next.dailyCommitmentMinutes ||
    prev.lastLessonDate !== next.lastLessonDate ||
    prev.soundEnabled !== next.soundEnabled ||
    prev.hapticEnabled !== next.hapticEnabled ||
    prev.onboardingComplete !== next.onboardingComplete ||
    prev.language !== next.language ||
    prev.communityIdentity !== next.communityIdentity ||
    prev.lastCheckinDate !== next.lastCheckinDate ||
    prev.lastAssessmentMonth !== next.lastAssessmentMonth ||
    // Profile identity fields
    prev.motto !== next.motto ||
    prev.accentColor !== next.accentColor ||
    prev.bannerKey !== next.bannerKey ||
    prev.equippedTitleId !== next.equippedTitleId ||
    JSON.stringify(prev.badgesEarned) !== JSON.stringify(next.badgesEarned) ||
    prev.profileVisibleInEchoes !== next.profileVisibleInEchoes ||
    prev.equippedFrameId !== next.equippedFrameId ||
    prev.featuredBadgeId !== next.featuredBadgeId
  );
}

function toStoreReflection(entry: {
  id?: string;
  lesson_id: string;
  content: string;
  created_at?: string;
  action_honesty?: string | null;
}): ReflectionEntry {
  const createdAt = entry.created_at ?? new Date().toISOString();
  return {
    id: entry.id ?? crypto.randomUUID(),
    lessonId: entry.lesson_id,
    lessonTitle: entry.lesson_id,
    coreConceptTag: 'synced',
    reflection: entry.content,
    actionCompleted: entry.action_honesty === 'yes' || entry.action_honesty === 'partially',
    date: createdAt,
  };
}

function toStoreWeeklyCheckin(entry: {
  id?: string;
  created_at?: string;
  week_of: string;
  responses?: unknown[];
  xp_earned?: number;
}): WeeklyCheckinData {
  const date = entry.created_at ?? `${entry.week_of}T00:00:00.000Z`;
  return {
    id: entry.id ?? crypto.randomUUID(),
    date,
    weekNumber: getWeekNumber(entry.week_of),
    responses: (entry.responses as CheckinResponseData[] | undefined) ?? [],
    xpEarned: entry.xp_earned ?? 50,
  };
}

function toStoreMonthlyAssessment(entry: {
  id?: string;
  created_at?: string;
  month: string;
  emotional_mastery: number;
  discipline: number;
  perspective: number;
  self_awareness: number;
  growth: number;
  reflection?: string | null;
  xp_earned?: number;
}): MonthlyAssessment {
  return {
    id: entry.id ?? crypto.randomUUID(),
    date: entry.created_at ?? new Date().toISOString(),
    month: entry.month,
    scores: {
      emotionalMastery: entry.emotional_mastery,
      discipline: entry.discipline,
      perspective: entry.perspective,
      selfAwareness: entry.self_awareness,
      growth: entry.growth,
    },
    reflection: entry.reflection ?? '',
    xpEarned: entry.xp_earned ?? 100,
  };
}

function toStoreIdentityStatement(entry: {
  id?: string;
  statement: string;
  created_at?: string;
  context?: unknown;
  tags?: string[];
}): IdentityStatement {
  const fallbackContext: IdentityContext = {
    type: 'manual',
    trigger: 'manual',
    description: 'Synced from cloud',
  };

  return {
    id: entry.id ?? crypto.randomUUID(),
    statement: entry.statement,
    createdAt: entry.created_at ?? new Date().toISOString(),
    context: isIdentityContext(entry.context) ? entry.context : fallbackContext,
    tags: entry.tags ?? [],
  };
}

function toPublicReflection(entry: {
  id?: string;
  lesson_id?: string | null;
  lesson_title?: string | null;
  user_id: string;
  author_gender?: string | null;
  content: string;
  created_at?: string;
  is_open_to_connect?: boolean;
}): PublicReflection {
  return {
    id: entry.id ?? crypto.randomUUID(),
    lessonId: entry.lesson_id ?? 'community',
    lessonTitle: entry.lesson_title ?? 'Community Reflection',
    authorId: entry.user_id,
    authorGender: normalizeGender(entry.author_gender),
    content: entry.content,
    createdAt: entry.created_at ?? new Date().toISOString(),
    isOpenToConnect: entry.is_open_to_connect ?? false,
  };
}

function toStoreEchoResponse(entry: {
  id?: string;
  echo_id: string;
  user_id: string;
  content: string;
  created_at?: string;
  responder_gender?: string | null;
  is_open_to_connect?: boolean;
}): EchoResponse {
  return {
    id: entry.id ?? crypto.randomUUID(),
    reflectionId: entry.echo_id,
    responderId: entry.user_id,
    responderGender: normalizeGender(entry.responder_gender),
    content: entry.content,
    createdAt: entry.created_at ?? new Date().toISOString(),
    isOpenToConnect: entry.is_open_to_connect ?? false,
    isRead: false,
  };
}

export function useSupabaseStoreSync() {
  const { user, isConfigured, isAuthenticated } = useAuth();
  const prevStateRef = useRef<StoreState>(useStore.getState());
  const prevEchoesStateRef = useRef<EchoesState>(useEchoesStore.getState());
  const hydratingRef = useRef(false);
  const hydratingEchoesRef = useRef(false);
  const activeUserIdRef = useRef<string | null>(null);
  const profileTimerRef = useRef<number | null>(null);
  const progressionTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isConfigured || !isAuthenticated || !user) {
      activeUserIdRef.current = null;
      return;
    }

    let cancelled = false;

    const hydrate = async () => {
      hydratingRef.current = true;
      try {
        const local = useStore.getState();
        const [profile, progressRows, reflectionRows, weeklyRows, monthlyRows, identityRows] = await Promise.all([
          getCurrentUserProfile(),
          listLessonProgress(user.id),
          listReflections(user.id),
          listWeeklyCheckins(user.id),
          listMonthlyAssessments(user.id),
          listIdentityStatements(user.id),
        ]);

        if (cancelled) {
          return;
        }

        if (!profile) {
          await upsertCurrentUserProfile(profilePayloadFromStore(local));
        }

        const remoteCompletedLessons = progressRows.reduce<Record<string, boolean>>((acc, row) => {
          if (row.completed) {
            acc[row.lesson_id] = true;
          }
          return acc;
        }, {});

        const mergedCompletedLessons: Record<string, boolean> = {
          ...local.completedLessons,
          ...remoteCompletedLessons,
        };

        const localReflectionMap = new Map(local.allReflections.map((entry) => [entry.id, entry]));
        for (const remote of reflectionRows) {
          const mapped = toStoreReflection(remote);
          localReflectionMap.set(mapped.id, mapped);
        }

        const localCheckinMap = new Map(local.weeklyCheckins.map((entry) => [entry.id, entry]));
        for (const remote of weeklyRows) {
          const mapped = toStoreWeeklyCheckin(remote);
          localCheckinMap.set(mapped.id, mapped);
        }

        const localAssessmentMap = new Map(local.monthlyAssessments.map((entry) => [entry.id, entry]));
        for (const remote of monthlyRows) {
          const mapped = toStoreMonthlyAssessment(remote);
          localAssessmentMap.set(mapped.id, mapped);
        }

        const localIdentityMap = new Map(local.identityStatements.map((entry) => [entry.id, entry]));
        for (const remote of identityRows) {
          const mapped = toStoreIdentityStatement(remote);
          localIdentityMap.set(mapped.id, mapped);
        }

        const mergedAllReflections = Array.from(localReflectionMap.values()).sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        const mergedWeeklyCheckins = Array.from(localCheckinMap.values()).sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        const mergedMonthlyAssessments = Array.from(localAssessmentMap.values()).sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        const mergedIdentityStatements = Array.from(localIdentityMap.values()).sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        useStore.setState((state) => ({
          ...state,
          userId: user.id,
          name: profile?.name ?? state.name,
          transformationGoal:
            profile?.transformation_goal && VALID_TRANSFORMATION_GOALS.includes(profile.transformation_goal as TransformationGoal)
              ? (profile.transformation_goal as TransformationGoal)
              : state.transformationGoal,
          whyStatement: profile?.why_statement ?? state.whyStatement,
          dailyCommitmentMinutes: profile?.daily_commitment_minutes ?? state.dailyCommitmentMinutes,
          totalXp: profile?.total_xp ?? state.totalXp,
          currentStreak: profile?.current_streak ?? state.currentStreak,
          longestStreak: profile?.longest_streak ?? state.longestStreak,
          graceDays: profile?.grace_days ?? state.graceDays,
          lastLessonDate: profile?.last_lesson_at ? profile.last_lesson_at.split('T')[0] : state.lastLessonDate,
          soundEnabled: profile?.sound_enabled ?? state.soundEnabled,
          hapticEnabled: profile?.haptic_enabled ?? state.hapticEnabled,
          onboardingComplete: profile?.onboarding_complete ?? state.onboardingComplete,
          language:
            profile?.language && VALID_LANGUAGES.includes(profile.language as StoreState['language'])
              ? (profile.language as StoreState['language'])
              : state.language,
          communityIdentity:
            profile?.community_identity &&
            VALID_COMMUNITY_IDENTITIES.includes(profile.community_identity as NonNullable<StoreState['communityIdentity']>)
              ? (profile.community_identity as NonNullable<StoreState['communityIdentity']>)
              : state.communityIdentity,
          lastCheckinDate: profile?.last_checkin_date ?? state.lastCheckinDate,
          lastAssessmentMonth: profile?.last_assessment_month ?? state.lastAssessmentMonth,
          // Profile identity fields
          avatarUrl: profile?.avatar_url ?? state.avatarUrl,
          motto: profile?.motto ?? state.motto,
          accentColor: profile?.accent_color && VALID_ACCENT_COLORS.includes(profile.accent_color as StoreState['accentColor'])
            ? (profile.accent_color as StoreState['accentColor'])
            : state.accentColor,
          bannerKey: profile?.banner_key ?? state.bannerKey,
          equippedTitleId: profile?.equipped_title_id ?? state.equippedTitleId,
          badgesEarned: Array.isArray(profile?.badges_earned)
            && profile.badges_earned.every((b: unknown) => typeof b === 'object' && b !== null && 'badgeId' in b && 'earnedAt' in b)
            ? (profile.badges_earned as StoreState['badgesEarned'])
            : state.badgesEarned,
          profileVisibleInEchoes: profile?.profile_visible_in_echoes ?? state.profileVisibleInEchoes,
          equippedFrameId: profile?.equipped_frame_id && VALID_FRAME_IDS.includes(profile.equipped_frame_id as NonNullable<StoreState['equippedFrameId']>)
            ? (profile.equipped_frame_id as StoreState['equippedFrameId'])
            : state.equippedFrameId,
          featuredBadgeId: (profile?.featured_badge_id as string | null) ?? state.featuredBadgeId,
          // Server-owned: ALWAYS trust server
          isSupporter: profile?.is_supporter ?? false,
          supporterSince: profile?.supporter_since ?? null,
          completedLessons: mergedCompletedLessons,
          allReflections: mergedAllReflections,
          reflections: mergedAllReflections.slice(-14),
          weeklyCheckins: mergedWeeklyCheckins,
          monthlyAssessments: mergedMonthlyAssessments,
          identityStatements: mergedIdentityStatements,
        }));

        prevStateRef.current = useStore.getState();
        activeUserIdRef.current = user.id;
      } catch (error) {
        console.error('Failed to hydrate store from Supabase', error);
      } finally {
        hydratingRef.current = false;
      }
    };

    void hydrate();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isConfigured, user?.id]);

  useEffect(() => {
    if (!isConfigured || !isAuthenticated || !user) {
      return;
    }

    const unsubscribe = useStore.subscribe((state) => {
      const prev = prevStateRef.current;
      prevStateRef.current = state;

      if (hydratingRef.current || activeUserIdRef.current !== user.id) {
        return;
      }

      if (state.userId !== user.id) {
        useStore.setState({ userId: user.id });
      }

      if (profileFieldsChanged(prev, state)) {
        if (profileTimerRef.current !== null) {
          window.clearTimeout(profileTimerRef.current);
        }

        profileTimerRef.current = window.setTimeout(() => {
          void upsertCurrentUserProfile(profilePayloadFromStore(useStore.getState())).catch((error) => {
            console.error('Failed to sync profile to Supabase', error);
          });
        }, PROFILE_SYNC_DEBOUNCE_MS);
      }

      if (progressionFieldsChanged(prev, state)) {
        if (progressionTimerRef.current !== null) {
          window.clearTimeout(progressionTimerRef.current);
        }

        progressionTimerRef.current = window.setTimeout(() => {
          const s = useStore.getState();
          void syncProgression({
            total_xp: s.totalXp,
            current_streak: s.currentStreak,
            longest_streak: s.longestStreak,
            grace_days: s.graceDays,
          }).catch((error) => {
            console.error('Failed to sync progression to Supabase', error);
          });
        }, PROFILE_SYNC_DEBOUNCE_MS);
      }

      const newlyCompletedLessonIds = Object.keys(state.completedLessons).filter(
        (lessonId) => state.completedLessons[lessonId] && !prev.completedLessons[lessonId]
      );

      for (const lessonId of newlyCompletedLessonIds) {
        void upsertLessonProgress({
          user_id: user.id,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString(),
          action_completed: true,
          reflection_written: false,
          xp_earned: 0,
        }).catch((error) => {
          console.error(`Failed to sync lesson progress for ${lessonId}`, error);
        });
      }

      const prevReflectionIds = new Set(prev.allReflections.map((item) => item.id));
      const newReflections = state.allReflections.filter((reflection) => !prevReflectionIds.has(reflection.id));

      for (const reflection of newReflections) {
        const payload = {
          user_id: user.id,
          lesson_id: reflection.lessonId,
          content: reflection.reflection,
          word_count: countWords(reflection.reflection),
          action_honesty: reflection.actionCompleted ? 'yes' : 'no',
          created_at: reflection.date,
          is_public: true,
          ...(isUuid(reflection.id) ? { id: reflection.id } : {}),
        };

        void createReflection(payload).catch((error) => {
          console.error(`Failed to sync reflection ${reflection.id}`, error);
        });
      }

      const prevCheckinIds = new Set(prev.weeklyCheckins.map((item) => item.id));
      const newCheckins = state.weeklyCheckins.filter((item) => !prevCheckinIds.has(item.id));

      for (const checkin of newCheckins) {
        void upsertWeeklyCheckin({
          ...(isUuid(checkin.id) ? { id: checkin.id } : {}),
          user_id: user.id,
          week_of: toIsoDate(checkin.date),
          responses: checkin.responses,
          xp_earned: checkin.xpEarned,
          created_at: checkin.date,
        }).catch((error) => {
          console.error(`Failed to sync weekly checkin ${checkin.id}`, error);
        });
      }

      const prevAssessmentIds = new Set(prev.monthlyAssessments.map((item) => item.id));
      const newAssessments = state.monthlyAssessments.filter((item) => !prevAssessmentIds.has(item.id));

      for (const assessment of newAssessments) {
        void upsertMonthlyAssessment({
          ...(isUuid(assessment.id) ? { id: assessment.id } : {}),
          user_id: user.id,
          month: assessment.month,
          emotional_mastery: assessment.scores.emotionalMastery,
          discipline: assessment.scores.discipline,
          perspective: assessment.scores.perspective,
          self_awareness: assessment.scores.selfAwareness,
          growth: assessment.scores.growth,
          reflection: assessment.reflection,
          xp_earned: assessment.xpEarned,
          created_at: assessment.date,
        }).catch((error) => {
          console.error(`Failed to sync monthly assessment ${assessment.id}`, error);
        });
      }

      const prevIdentityIds = new Set(prev.identityStatements.map((item) => item.id));
      const newIdentityStatements = state.identityStatements.filter((item) => !prevIdentityIds.has(item.id));

      for (const statement of newIdentityStatements) {
        void createIdentityStatement({
          ...(isUuid(statement.id) ? { id: statement.id } : {}),
          user_id: user.id,
          statement: statement.statement,
          context: statement.context,
          tags: statement.tags,
          created_at: statement.createdAt,
        }).catch((error) => {
          console.error(`Failed to sync identity statement ${statement.id}`, error);
        });
      }
    });

    return () => {
      unsubscribe();
      if (profileTimerRef.current !== null) {
        window.clearTimeout(profileTimerRef.current);
        profileTimerRef.current = null;
      }
      if (progressionTimerRef.current !== null) {
        window.clearTimeout(progressionTimerRef.current);
        progressionTimerRef.current = null;
      }
    };
  }, [isAuthenticated, isConfigured, user?.id]);

  useEffect(() => {
    if (!isConfigured || !isAuthenticated || !user) {
      return;
    }

    let cancelled = false;

    const hydrateEchoes = async () => {
      hydratingEchoesRef.current = true;
      try {
        const local = useEchoesStore.getState();
        const [remoteEchoes, sentResponses, receivedResponses] = await Promise.all([
          listCommunityEchoes(200),
          listSentEchoResponses(user.id),
          listReceivedEchoResponses(user.id),
        ]);

        if (cancelled) {
          return;
        }

        const reflectionMap = new Map(local.publicReflections.map((item) => [item.id, item]));
        for (const remote of remoteEchoes) {
          const mapped = toPublicReflection(remote);
          reflectionMap.set(mapped.id, mapped);
        }

        const mergedPublicReflections = Array.from(reflectionMap.values()).sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        const sentMap = new Map(local.sentEchos.map((item) => [item.id, item]));
        for (const remote of sentResponses) {
          const mapped = toStoreEchoResponse(remote);
          sentMap.set(mapped.id, mapped);
        }

        const receivedMap = new Map(local.receivedEchos.map((item) => [item.id, item]));
        for (const remote of receivedResponses) {
          const mapped = toStoreEchoResponse(remote);
          receivedMap.set(mapped.id, mapped);
        }

        const mergedSentEchos = Array.from(sentMap.values()).sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        const mergedReceivedEchos = Array.from(receivedMap.values()).sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        useEchoesStore.setState((state) => ({
          ...state,
          publicReflections: mergedPublicReflections,
          sentEchos: mergedSentEchos,
          receivedEchos: mergedReceivedEchos,
        }));

        prevEchoesStateRef.current = useEchoesStore.getState();
      } catch (error) {
        console.error('Failed to hydrate community echoes from Supabase', error);
      } finally {
        hydratingEchoesRef.current = false;
      }
    };

    void hydrateEchoes();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isConfigured, user?.id]);

  useEffect(() => {
    if (!isConfigured || !isAuthenticated || !user) {
      return;
    }

    const unsubscribe = useEchoesStore.subscribe((state) => {
      const prev = prevEchoesStateRef.current;
      prevEchoesStateRef.current = state;

      if (hydratingEchoesRef.current) {
        return;
      }

      const prevIds = new Set(prev.publicReflections.map((item) => item.id));
      const newReflections = state.publicReflections.filter((item) => !prevIds.has(item.id));

      for (const reflection of newReflections) {
        const authoredByCurrentUser = reflection.authorId === 'current-user' || reflection.authorId === user.id;
        if (!authoredByCurrentUser) {
          continue;
        }

        void createCommunityEcho({
          ...(isUuid(reflection.id) ? { id: reflection.id } : {}),
          user_id: user.id,
          lesson_id: reflection.lessonId,
          lesson_title: reflection.lessonTitle,
          author_gender: normalizeGender(reflection.authorGender),
          content: reflection.content,
          is_open_to_connect: reflection.isOpenToConnect,
          created_at: reflection.createdAt,
        }).catch((error) => {
          console.error(`Failed to sync community echo ${reflection.id}`, error);
        });
      }

      const prevResponseIds = new Set(prev.sentEchos.map((item) => item.id));
      const newResponses = state.sentEchos.filter((item) => !prevResponseIds.has(item.id));

      for (const response of newResponses) {
        if (!isUuid(response.reflectionId)) {
          continue;
        }

        const responderIsCurrentUser = response.responderId === 'current-user' || response.responderId === user.id;
        if (!responderIsCurrentUser) {
          continue;
        }

        void respondToEcho({
          ...(isUuid(response.id) ? { id: response.id } : {}),
          user_id: user.id,
          echo_id: response.reflectionId,
          content: response.content,
          responder_gender: normalizeGender(response.responderGender),
          is_open_to_connect: response.isOpenToConnect,
          created_at: response.createdAt,
        }).catch((error) => {
          console.error(`Failed to sync echo response ${response.id}`, error);
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isAuthenticated, isConfigured, user?.id]);
}
