'use client';

// ============================================================================
// ACTIVITY LOGGER PROVIDER
// Wraps the app, provides logEvent/trackView to all children,
// and auto-logs Zustand store state changes via subscribers.
// ============================================================================

import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';
import { useActivityLogger } from '@/hooks/useActivityLogger';
import { useStore } from '@/store/useStore';
import { useDailyPracticeStore } from '@/store/useDailyPracticeStore';
import { useEchoesStore } from '@/store/useEchoesStore';

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────────────────────────────────────

interface ActivityLoggerContextValue {
  logEvent: (type: string, data?: Record<string, unknown>) => void;
  trackView: (viewName: string) => void;
  updateUser: (userId: string, userName?: string | null) => void;
}

const ActivityLoggerContext = createContext<ActivityLoggerContextValue>({
  logEvent: () => {},
  trackView: () => {},
  updateUser: () => {},
});

export function useActivityLog() {
  return useContext(ActivityLoggerContext);
}

// ─────────────────────────────────────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────────────────────────────────────

export function ActivityLoggerProvider({ children }: { children: ReactNode }) {
  const logger = useActivityLogger();
  const subscribedRef = useRef(false);

  // ─── ZUSTAND STORE SUBSCRIBERS ───────────────────────────────────────────
  // These watch for state changes and auto-log events without modifying stores.

  useEffect(() => {
    if (subscribedRef.current) return;
    subscribedRef.current = true;

    const logEvent = logger.logEvent;
    const updateUser = logger.updateUser;

    // ─── MAIN STORE ─────────────────────────────────────────────────────

    type MainState = ReturnType<typeof useStore.getState>;
    let prevMain: MainState = useStore.getState();

    const unsubMain = useStore.subscribe((state: MainState) => {
      const prev = prevMain;

      // Language change
      if (state.language !== prev.language && prev.languageSelected) {
        logEvent('language_changed', { from: prev.language, to: state.language });
      }

      // Language selected (first time)
      if (state.languageSelected && !prev.languageSelected) {
        logEvent('language_selected', { language: state.language });
      }

      // Onboarding step progression
      if (state.onboardingStep !== prev.onboardingStep) {
        logEvent('onboarding_step_changed', { step: state.onboardingStep });
      }

      // Transformation goal set
      if (state.transformationGoal && state.transformationGoal !== prev.transformationGoal) {
        logEvent('transformation_goal_set', { goal: state.transformationGoal });
      }

      // Community identity set
      if (state.communityIdentity && state.communityIdentity !== prev.communityIdentity) {
        logEvent('community_identity_set', { identity: state.communityIdentity });
      }

      // Daily commitment set
      if (state.dailyCommitmentMinutes !== prev.dailyCommitmentMinutes && state.onboardingStep > 0) {
        logEvent('daily_commitment_set', { minutes: state.dailyCommitmentMinutes });
      }

      // Onboarding completed
      if (state.onboardingComplete && !prev.onboardingComplete) {
        logEvent('onboarding_completed', {
          goal: state.transformationGoal,
          commitment: state.dailyCommitmentMinutes,
          identity: state.communityIdentity,
        });
        // Update session with new userId
        if (state.userId) {
          updateUser(state.userId, state.name);
        }
      }

      // Lesson completed (detect new lessons)
      const prevLessonIds = Object.keys(prev.completedLessons);
      const newLessonIds = Object.keys(state.completedLessons);
      if (newLessonIds.length > prevLessonIds.length) {
        const newlyCompleted = newLessonIds.filter((id) => !prev.completedLessons[id]);
        for (const lessonId of newlyCompleted) {
          logEvent('lesson_completed', {
            lessonId,
            totalXp: state.totalXp,
            world: state.currentWorldSlug,
          });
        }
      }

      // XP change (only meaningful changes, not initial load)
      if (state.totalXp !== prev.totalXp && prev.totalXp > 0) {
        const xpGained = state.totalXp - prev.totalXp;
        if (xpGained > 0) {
          logEvent('xp_earned', { amount: xpGained, total: state.totalXp });
        }
      }

      // Streak changes
      if (state.currentStreak !== prev.currentStreak && state.currentStreak > prev.currentStreak) {
        logEvent('streak_updated', {
          current: state.currentStreak,
          longest: state.longestStreak,
        });
      }

      // Grace day used
      if (state.graceDays < prev.graceDays) {
        logEvent('grace_day_used', { remaining: state.graceDays });
      }

      // Grace day earned
      if (state.graceDays > prev.graceDays) {
        logEvent('grace_day_earned', { total: state.graceDays });
      }

      // New reflection saved
      if (state.allReflections.length > prev.allReflections.length) {
        const latest = state.allReflections[state.allReflections.length - 1];
        logEvent('reflection_saved', {
          lessonId: latest?.lessonId,
          wordCount: latest?.reflection?.split(/\s+/).length || 0,
          actionCompleted: latest?.actionCompleted,
        });
      }

      // Weekly check-in completed
      if (state.weeklyCheckins.length > prev.weeklyCheckins.length) {
        const latest = state.weeklyCheckins[state.weeklyCheckins.length - 1];
        logEvent('weekly_checkin_completed', {
          weekNumber: latest?.weekNumber,
          responseCount: latest?.responses?.length || 0,
          xpEarned: latest?.xpEarned,
        });
      }

      // Monthly assessment completed
      if (state.monthlyAssessments.length > prev.monthlyAssessments.length) {
        const latest = state.monthlyAssessments[state.monthlyAssessments.length - 1];
        logEvent('monthly_assessment_completed', {
          month: latest?.month,
          xpEarned: latest?.xpEarned,
        });
      }

      // Wisdom in action logged
      if (state.wisdomInActionLogs.length > prev.wisdomInActionLogs.length) {
        logEvent('wisdom_in_action_logged', {
          tagCount: state.wisdomInActionLogs[state.wisdomInActionLogs.length - 1]?.tags?.length || 0,
        });
      }

      // Identity statement saved
      if (state.identityStatements.length > prev.identityStatements.length) {
        const latest = state.identityStatements[state.identityStatements.length - 1];
        logEvent('identity_statement_saved', {
          tagCount: latest?.tags?.length || 0,
          contextType: latest?.context?.type,
        });
      }

      // Achievement unlocked
      if (state.unlockedAchievements.length > prev.unlockedAchievements.length) {
        const newAchievements = state.unlockedAchievements.slice(prev.unlockedAchievements.length);
        for (const a of newAchievements) {
          logEvent('achievement_unlocked', { achievementId: a.achievementId });
        }
      }

      // Achievement celebrated
      const newlyCelebrated = state.unlockedAchievements.filter(
        (a) => a.celebrated && !prev.unlockedAchievements.find((p) => p.achievementId === a.achievementId)?.celebrated
      );
      for (const a of newlyCelebrated) {
        logEvent('achievement_celebrated', { achievementId: a.achievementId });
      }

      // Sound toggled
      if (state.soundEnabled !== prev.soundEnabled) {
        logEvent('sound_toggled', { enabled: state.soundEnabled });
      }

      // Haptic toggled
      if (state.hapticEnabled !== prev.hapticEnabled) {
        logEvent('haptic_toggled', { enabled: state.hapticEnabled });
      }

      // World switched
      if (state.currentWorldSlug && state.currentWorldSlug !== prev.currentWorldSlug && prev.currentWorldSlug) {
        logEvent('world_switched', { from: prev.currentWorldSlug, to: state.currentWorldSlug });
      }

      // Current lesson set (lesson started)
      if (state.currentLessonId && state.currentLessonId !== prev.currentLessonId) {
        logEvent('lesson_started', { lessonId: state.currentLessonId, world: state.currentWorldSlug });
      }

      // Coaching step seen
      for (const key of Object.keys(state.coachingStepsSeen) as Array<keyof typeof state.coachingStepsSeen>) {
        if (state.coachingStepsSeen[key] && !prev.coachingStepsSeen[key]) {
          logEvent('coaching_step_seen', { step: key });
        }
      }

      // First session completed
      if (state.firstSessionComplete && !prev.firstSessionComplete) {
        logEvent('first_session_completed');
      }

      // User reset
      if (!state.onboardingComplete && prev.onboardingComplete && !state.userId && prev.userId) {
        logEvent('user_reset');
      }

      // Help dismissed
      const prevHelpKeys = Object.keys(prev.helpDismissed);
      const newHelpKeys = Object.keys(state.helpDismissed);
      if (newHelpKeys.length > prevHelpKeys.length) {
        const newDismissals = newHelpKeys.filter((k) => !prev.helpDismissed[k]);
        for (const helpId of newDismissals) {
          logEvent('help_dismissed', { helpId });
        }
      }

      prevMain = state;
    });

    // ─── DAILY PRACTICE STORE ───────────────────────────────────────────

    type DailyState = ReturnType<typeof useDailyPracticeStore.getState>;
    let prevDaily: DailyState = useDailyPracticeStore.getState();

    const unsubDaily = useDailyPracticeStore.subscribe((state: DailyState) => {
      const prev = prevDaily;

      if (state.todayProgress && prev.todayProgress) {
        // Lesson phase completed
        if (state.todayProgress.lessonCompleted && !prev.todayProgress.lessonCompleted) {
          logEvent('daily_lesson_phase_completed');
        }

        // Echo phase completed
        if (state.todayProgress.mandatoryEchoCompleted && !prev.todayProgress.mandatoryEchoCompleted) {
          logEvent('daily_echo_phase_completed', {
            reflectionId: state.todayProgress.echoReflectionId,
          });
        }

        // Exercise completed
        if (
          state.todayProgress.exercisesCompleted.length >
          prev.todayProgress.exercisesCompleted.length
        ) {
          const newExercises = state.todayProgress.exercisesCompleted.filter(
            (id) => !prev.todayProgress!.exercisesCompleted.includes(id)
          );
          for (const exerciseId of newExercises) {
            logEvent('daily_exercise_completed', { exerciseId });
          }
        }

        // All phases complete
        if (state.todayProgress.allPhasesComplete && !prev.todayProgress.allPhasesComplete) {
          logEvent('daily_all_phases_completed');
        }
      }

      // World completed
      if (state.globalCalendar?.isWorldComplete && !prev.globalCalendar?.isWorldComplete) {
        logEvent('world_completed', { worldId: state.globalCalendar.currentWorld.worldId });
      }

      prevDaily = state;
    });

    // ─── ECHOES STORE ───────────────────────────────────────────────────

    type EchoState = ReturnType<typeof useEchoesStore.getState>;
    let prevEchoes: EchoState = useEchoesStore.getState();

    const unsubEchoes = useEchoesStore.subscribe((state: EchoState) => {
      const prev = prevEchoes;

      // Reflection published
      if (state.publicReflections.length > prev.publicReflections.length) {
        const latest = state.publicReflections[state.publicReflections.length - 1];
        logEvent('reflection_published', {
          lessonId: latest?.lessonId,
          isOpenToConnect: latest?.isOpenToConnect,
          wordCount: latest?.content?.split(/\s+/).length || 0,
        });
      }

      // Echo response sent
      if (state.sentEchos.length > prev.sentEchos.length) {
        const latest = state.sentEchos[state.sentEchos.length - 1];
        logEvent('echo_response_sent', {
          reflectionId: latest?.reflectionId,
          isOpenToConnect: latest?.isOpenToConnect,
          wordCount: latest?.content?.split(/\s+/).length || 0,
        });
      }

      // Connection invitation sent
      if (state.sentInvitations.length > prev.sentInvitations.length) {
        logEvent('connection_invitation_sent');
      }

      // Invitation responded to
      const respondedInvitations = state.receivedInvitations.filter(
        (i) => i.status !== 'pending'
      );
      const prevResponded = prev.receivedInvitations.filter(
        (i) => i.status !== 'pending'
      );
      if (respondedInvitations.length > prevResponded.length) {
        const latest = respondedInvitations[respondedInvitations.length - 1];
        logEvent('connection_invitation_responded', {
          accepted: latest?.status === 'accepted',
        });
      }

      // Message sent
      if (state.messages.length > prev.messages.length) {
        const latest = state.messages[state.messages.length - 1];
        if (latest?.senderId === 'current-user') {
          logEvent('message_sent', {
            connectionId: latest.connectionId,
            wordCount: latest.content?.split(/\s+/).length || 0,
          });
        }
      }

      // Gender identity set
      if (state.genderIdentity && state.genderIdentity !== prev.genderIdentity) {
        logEvent('gender_identity_set', { gender: state.genderIdentity });
      }

      prevEchoes = state;
    });

    // Cleanup
    return () => {
      unsubMain();
      unsubDaily();
      unsubEchoes();
    };
  }, [logger.logEvent, logger.updateUser]);

  return (
    <ActivityLoggerContext.Provider value={logger}>
      {children}
    </ActivityLoggerContext.Provider>
  );
}
