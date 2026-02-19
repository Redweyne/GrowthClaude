'use client';

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { useEchoesStore } from '@/store/useEchoesStore';
import { useDailyPracticeStore } from '@/store/useDailyPracticeStore';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { LanguageSelector } from '@/components/language';
import { DailyFlowHome } from '@/components/daily/DailyFlowHome';
import { MandatoryEchoFlow } from '@/components/daily/MandatoryEchoFlow';
import { DashboardNew } from '@/components/dashboard/DashboardNew';
import { CoachModal, CoachingStep } from '@/components/coaching';
import { LoginModal } from '@/components/auth/LoginModal';
import { SignupModal } from '@/components/auth/SignupModal';
import { ExerciseExperience } from '@/components/exercises/ExerciseExperience';
import { WorldMap, WorldSwitcher } from '@/components/world';
import { FlexibleLessonExperience } from '@/components/lesson/FlexibleLessonExperience';
import { LessonPreview } from '@/components/lesson/LessonPreview';
import { PracticeMode } from '@/components/practice';
import { WeeklyCheckin } from '@/components/checkin';
import { MonthlyAssessment } from '@/components/assessment';
import { TransformationHub } from '@/components/transformation';
import { ProgressDashboard } from '@/components/progress';
import { AchievementGallery, AchievementCelebration } from '@/components/achievements';
import { IdentityScreen } from '@/components/identity';
import { TransformationStory, ShareableStoryCard } from '@/components/story';
import { EchoPrompt, EchoReview, EchoInbox } from '@/components/echoes';
import { SettingsPanel } from '@/components/settings';
import { useTransformationStory } from '@/hooks';
import { useAudio } from '@/hooks/useAudio';
import { TransformationStory as TransformationStoryType } from '@/types/story';
import { getLevelFromXp } from '@/types';
import type { PublicReflection } from '@/types/echoes';
import { getModernWisdomWorld } from '@/content/modernWisdom';
import { useTranslation } from '@/i18n';
import type { FlexibleLesson, LessonProgress, LessonMode, FlexibleWorld } from '@/types/lessons';
import { LessonModeSelector } from '@/components/lesson/LessonModeSelector';
import { SparkFeed, SparkUnlockScreen } from '@/components/spark';
import { useSparkStore } from '@/store/useSparkStore';
import { BottomNavBar, type NavTab } from '@/components/navigation/BottomNavBar';
import { backgroundMusic } from '@/lib/backgroundMusic';
import { useActivityLog } from '@/providers/ActivityLoggerProvider';

type AppView =
  | 'home'
  | 'dashboard'
  | 'map'
  | 'lesson'
  | 'lesson-preview'
  | 'lesson-mode-select'
  | 'mandatory-echo'
  | 'exercises'
  | 'practice'
  | 'checkin'
  | 'assessment'
  | 'transformation'
  | 'progress'
  | 'achievements'
  | 'identity'
  | 'settings'
  | 'worldSwitcher'
  | 'echoes'
  | 'echo-review'
  | 'spark'
  | 'spark-unlock';

export default function Home() {
  // Hydration guard: Zustand persist middleware loads state from localStorage
  // asynchronously. Before hydration completes, store values are defaults
  // (e.g., languageSelected=false), causing a flash of the wrong screen.
  // Wait for hydration before rendering to prevent this.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Zustand persist hydration happens synchronously during module init,
    // but the React state update is async. Using useEffect ensures we
    // wait for the first render cycle to complete.
    setHydrated(true);
  }, []);

  const {
    languageSelected,
    onboardingComplete,
    completedLessons,
    isCheckinDue,
    isAssessmentDue,
    getPendingLessonAction,
    getInProgressLesson,
    clearInProgressLesson,
    currentWorldSlug: storedWorldSlug,
    setCurrentWorld,
    totalXp,
    currentStreak,
    longestStreak,
    name: userName,
    transformationGoal,
    identityStatements: userIdentityStatements,
    getProgressStats,
    isFirstSession,
    isCoachingStepSeen,
    markCoachingStepSeen,
    completeFirstSession,
  } = useStore();
  const {
    shouldShowEchoPrompt,
    markEchoPromptSeen,
    getReflectionToReview,
    getUnreadEchoCount,
    getUnreadInvitationCount,
    getUnreadMessageCount
  } = useEchoesStore();

  // Daily practice store
  const {
    initializeToday,
    getTodaysLesson,
    getTomorrowsLesson,
    getCurrentDayNumber,
    getTotalDaysInWorld,
    getDailyFlowState,
    getExercisesCompletedToday,
    completeLesson,
    completeMandatoryEcho,
    completeExercise,
    markDailyComplete,
  } = useDailyPracticeStore();

  // Spark store
  const {
    hasSeenUnlockScreen: sparkUnlockSeen,
    markUnlockScreenSeen: markSparkUnlockSeen,
    isForcedClosedToday: isSparkForcedClosed,
  } = useSparkStore();

  const { locale } = useTranslation();
  const { logEvent, trackView } = useActivityLog();

  const [currentView, setCurrentView] = useState<AppView>('home');
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [selectedFlexibleLesson, setSelectedFlexibleLesson] = useState<FlexibleLesson | null>(null);
  const [flexibleLessonProgress, setFlexibleLessonProgress] = useState<LessonProgress | null>(null);
  const [lessonMode, setLessonMode] = useState<LessonMode>('deep');

  // Echoes state
  const [showEchoPrompt, setShowEchoPrompt] = useState(false);
  const [reflectionForReview, setReflectionForReview] = useState<PublicReflection | null>(null);
  const [completedLessonInfo, setCompletedLessonInfo] = useState<{ id: string; title: string } | null>(null);
  const [skipEchoIntro, setSkipEchoIntro] = useState(false); // Track if coaching was shown to skip echo intro
  // Store exercises from the completed lesson to ensure they're available for the exercise view
  const [exercisesForSession, setExercisesForSession] = useState<FlexibleLesson['exercises'] | null>(null);

  // Story state
  const [activeStory, setActiveStory] = useState<TransformationStoryType | null>(null);
  const [showShareCard, setShowShareCard] = useState(false);
  const { generateStory, canGenerateStory, generateDemoStory } = useTransformationStory();
  const { stopAllAudio } = useAudio();
  const prevOnboardingCompleteRef = useRef(onboardingComplete);

  // Coaching modal state (first-session guidance)
  const [coachingModal, setCoachingModal] = useState<CoachingStep | null>(null);

  // Show coaching modal if appropriate
  const showCoaching = useCallback((step: CoachingStep) => {
    if (isFirstSession() && !isCoachingStepSeen(step)) {
      setCoachingModal(step);
    }
  }, [isFirstSession, isCoachingStepSeen]);

  useEffect(() => {
    if (!prevOnboardingCompleteRef.current && onboardingComplete) {
      // Onboarding just completed - ensure all audio is stopped
      // The debounce in audioEngine handles if this was already called by OnboardingFlow
      stopAllAudio(true);
    }
    prevOnboardingCompleteRef.current = onboardingComplete;
  }, [onboardingComplete, stopAllAudio]);

  useEffect(() => {
    if (!onboardingComplete) return;
    if (currentView !== 'lesson') {
      backgroundMusic.stop();
    }
  }, [currentView, onboardingComplete]);

  // Handle opening the story
  const handleOpenStory = useCallback(() => {
    if (!canGenerateStory) return;
    const story = generateStory('on_demand');
    if (story) {
      setActiveStory(story);
    }
  }, [canGenerateStory, generateStory]);

  // Handle opening demo story (without modifying user data)
  const handleOpenDemoStory = useCallback(() => {
    const demoStory = generateDemoStory();
    if (demoStory) {
      setActiveStory(demoStory);
    }
  }, [generateDemoStory]);

  // Handle closing the story
  const handleCloseStory = useCallback(() => {
    setActiveStory(null);
    setShowShareCard(false);
  }, []);

  // Handle sharing the story
  const handleShareStory = useCallback(() => {
    setShowShareCard(true);
  }, []);

  // Handle story completion
  const handleStoryComplete = useCallback(() => {
    // Could track completion here
  }, []);

  // All available worlds
  const modernWisdomWorld = useMemo(() => getModernWisdomWorld(locale), [locale]);
  const allWorlds: FlexibleWorld[] = [modernWisdomWorld];

  // Check for in-progress lesson on mount (page refresh resilience)
  // This runs once on mount to restore lesson progress if the user refreshed the page
  useEffect(() => {
    const inProgress = getInProgressLesson();
    if (inProgress && onboardingComplete) {
      // Find the lesson and resume
      const lesson = getFlexibleLessonById(inProgress.lessonId);
      if (lesson) {
        // Check if the lesson was updated recently (within last 4 hours)
        // to avoid resuming very old sessions
        const lastUpdated = new Date(inProgress.lastUpdated);
        const hoursSinceUpdate = (Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60);

        if (hoursSinceUpdate < 4) {
          setSelectedFlexibleLesson(lesson);
          setLessonMode(inProgress.mode || 'deep');
          setFlexibleLessonProgress({
            lessonId: inProgress.lessonId,
            currentStepId: inProgress.currentStepId,
            choices: inProgress.choices,
            writings: inProgress.writings,
            hasReturned: false,
            mode: inProgress.mode,
          });
          setCurrentView('lesson');
        } else {
          // Too old, clear the saved progress
          clearInProgressLesson();
        }
      } else {
        // Lesson no longer exists, clear the saved progress
        clearInProgressLesson();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount

  // Initialize daily practice on mount
  useEffect(() => {
    initializeToday(allWorlds);
  }, []);

  // Handle missing reflection for mandatory echo
  // (must be declared here with all other hooks, before any conditional returns)
  useEffect(() => {
    if (currentView === 'mandatory-echo' && !reflectionForReview) {
      completeMandatoryEcho('no-reflection-available');
      setCurrentView('exercises');
    }
  }, [currentView, reflectionForReview, completeMandatoryEcho]);

  // ─── Activity Logging: track view transitions ─────────────────────────
  useEffect(() => {
    // Compute the logical view (including pre-app states)
    let logicalView: string;
    if (!languageSelected) {
      logicalView = 'language-select';
    } else if (!onboardingComplete) {
      logicalView = 'onboarding';
    } else {
      logicalView = currentView;
    }
    trackView(logicalView);
  }, [currentView, languageSelected, onboardingComplete, trackView]);

  // ─── Activity Logging: log lesson mode selection ──────────────────────
  useEffect(() => {
    if (currentView === 'lesson' && selectedFlexibleLesson) {
      logEvent('lesson_mode_selected', {
        lessonId: selectedFlexibleLesson.id,
        mode: lessonMode,
      });
    }
  // Only fire when entering lesson view, not on every re-render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView === 'lesson' && selectedFlexibleLesson?.id]);

  // Get daily practice state
  const todaysLesson = getTodaysLesson(allWorlds);
  const tomorrowsLesson = getTomorrowsLesson(allWorlds);
  const dayNumber = getCurrentDayNumber();
  const totalDaysInWorld = getTotalDaysInWorld();
  const dailyFlowState = getDailyFlowState();
  const exercisesCompletedToday = getExercisesCompletedToday();
  const level = getLevelFromXp(totalXp);

  // Current active world state (from store, default to modern-wisdom)
  const currentWorldSlug = storedWorldSlug || 'modern-wisdom';
  const [showWorldSwitcher, setShowWorldSwitcher] = useState(false);

  // Bottom nav tab change handler
  const handleTabChange = useCallback((tab: NavTab) => {
    switch (tab) {
      case 'home': setCurrentView('home'); break;
      case 'journey': setCurrentView('map'); break;
      case 'spark':
        if (dailyFlowState.currentPhase === 'complete') {
          if (!sparkUnlockSeen) {
            markSparkUnlockSeen();
            setCurrentView('spark-unlock');
          } else {
            setCurrentView('spark');
          }
        }
        break;
      case 'echoes': setCurrentView('echoes'); break;
      case 'profile': setCurrentView('dashboard'); break;
    }
  }, [dailyFlowState.currentPhase, sparkUnlockSeen, markSparkUnlockSeen]);

  // Get the active world
  const activeWorld = allWorlds.find(w => w.slug === currentWorldSlug) || modernWisdomWorld;

  // Find the next incomplete lesson from active world
  const getNextFlexibleLesson = (): FlexibleLesson | null => {
    for (const chapter of activeWorld.chapters) {
      for (const lesson of chapter.lessons) {
        if (!completedLessons[lesson.id]) {
          return lesson;
        }
      }
    }
    return null;
  };

  // Get a flexible lesson by ID (search across ALL worlds for pending actions)
  const getFlexibleLessonById = (id: string): FlexibleLesson | null => {
    for (const world of allWorlds) {
      for (const chapter of world.chapters) {
        for (const lesson of chapter.lessons) {
          if (lesson.id === id) {
            return lesson;
          }
        }
      }
    }
    return null;
  };

  // Check for pending GoDoIt action on mount
  const pendingAction = getPendingLessonAction();

  const nextFlexibleLesson = getNextFlexibleLesson();

  // Helper: check if a lesson has an engagement path available
  const hasEngagementPath = (lesson: FlexibleLesson) =>
    !!(lesson.engagementSteps && lesson.engagementSteps.length > 0);

  // Dismiss coaching modal and navigate appropriately
  const dismissCoaching = useCallback(() => {
    if (coachingModal) {
      const currentStep = coachingModal;
      markCoachingStepSeen(currentStep);
      setCoachingModal(null);

      // Navigate based on which coaching step was dismissed
      switch (currentStep) {
        case 'beforeFirstLesson':
          // Now actually start the lesson — route through mode selection if applicable
          if (nextFlexibleLesson) {
            setSelectedFlexibleLesson(nextFlexibleLesson);
            setFlexibleLessonProgress(null);
            if (hasEngagementPath(nextFlexibleLesson)) {
              setCurrentView('lesson-mode-select');
            } else {
              setLessonMode('deep');
              setCurrentView('lesson-preview');
            }
          }
          break;
        case 'afterLessonBeforeEcho':
          // Continue to mandatory echo
          setCurrentView('mandatory-echo');
          break;
        case 'afterEchoBeforeExercises':
          // Continue to exercises
          setCurrentView('exercises');
          break;
        case 'afterFirstDayComplete':
          // Celebration done, mark first session complete and go home
          completeFirstSession();
          setCurrentView('home');
          break;
      }
    }
  }, [coachingModal, markCoachingStepSeen, completeFirstSession, nextFlexibleLesson]);

  // Handle lesson start from home
  const handleStartLesson = () => {
    // Show first-lesson coaching if this is their first session
    const lessonCount = Object.keys(completedLessons).length;
    if (lessonCount === 0 && isFirstSession() && !isCoachingStepSeen('beforeFirstLesson')) {
      showCoaching('beforeFirstLesson');
      return;
    }

    // Check for pending action first (user returning from GoDoIt)
    // GoDoIt only exists in deep mode, so skip mode selection
    if (pendingAction) {
      const lesson = getFlexibleLessonById(pendingAction.lessonId);
      if (lesson) {
        setSelectedFlexibleLesson(lesson);
        setLessonMode('deep');
        setFlexibleLessonProgress({
          lessonId: pendingAction.lessonId,
          currentStepId: pendingAction.currentStepId,
          choices: pendingAction.choices,
          writings: pendingAction.writings,
          dismissedAt: pendingAction.dismissedAt,
          hasReturned: true,
        });
        setCurrentView('lesson');
        return;
      }
    }

    // Start next lesson from active world
    if (nextFlexibleLesson) {
      setSelectedFlexibleLesson(nextFlexibleLesson);
      setFlexibleLessonProgress(null);

      // If the lesson has an engagement path, show mode selector first
      if (hasEngagementPath(nextFlexibleLesson)) {
        setCurrentView('lesson-mode-select');
      } else {
        setLessonMode('deep');
        setCurrentView('lesson-preview');
      }
    }
  };


  // Handle lesson select from map (including redo)
  const handleSelectLesson = (lessonId: string) => {
    const lesson = getFlexibleLessonById(lessonId);
    if (lesson) {
      setSelectedFlexibleLesson(lesson);
      setFlexibleLessonProgress(null);

      // If the lesson has an engagement path, show mode selector first
      if (hasEngagementPath(lesson)) {
        setCurrentView('lesson-mode-select');
      } else {
        setLessonMode('deep');
        setCurrentView('lesson-preview');
      }
    }
  };

  // Handle mode selection from LessonModeSelector
  const handleModeSelect = (mode: LessonMode) => {
    setLessonMode(mode);
    setCurrentView('lesson-preview');
  };

  // Handle lesson completion - now goes to mandatory echo
  const handleLessonComplete = () => {
    // CRITICAL: Stop all audio when leaving the lesson
    // This ensures background music doesn't continue playing through echo and exercises
    backgroundMusic.stop();
    stopAllAudio(false); // false = allow fadeout for smooth transition

    // Save completed lesson info for Echo prompt
    if (selectedFlexibleLesson) {
      setCompletedLessonInfo({
        id: selectedFlexibleLesson.id,
        title: selectedFlexibleLesson.title,
      });

      // Store exercises from the completed lesson for the exercise session
      // This ensures exercises are available even if todaysLesson changes
      if (selectedFlexibleLesson.exercises && selectedFlexibleLesson.exercises.length > 0) {
        setExercisesForSession(selectedFlexibleLesson.exercises);
      } else if (todaysLesson?.exercises) {
        // Fallback to today's lesson exercises if completed lesson has none
        setExercisesForSession(todaysLesson.exercises);
      }

      // Mark lesson complete in daily practice store
      completeLesson(selectedFlexibleLesson.xpReward || 50);

      // Get a reflection to review for mandatory echo
      const reflection = getReflectionToReview(selectedFlexibleLesson.id, selectedFlexibleLesson.title);
      if (reflection) {
        setReflectionForReview(reflection);
      }
    }

    setSelectedFlexibleLesson(null);
    setFlexibleLessonProgress(null);

    // Show coaching before echo if first session
    // Set skipEchoIntro to true so MandatoryEchoFlow skips its own intro (prevents double popup)
    if (isFirstSession() && !isCoachingStepSeen('afterLessonBeforeEcho')) {
      setSkipEchoIntro(true);
      showCoaching('afterLessonBeforeEcho');
      // Don't navigate yet - will navigate when coaching is dismissed
      return;
    }

    // No coaching shown, so show the echo intro
    setSkipEchoIntro(false);
    // Go to mandatory echo (no skipping!)
    setCurrentView('mandatory-echo');
  };

  // Handle mandatory echo completion
  const handleMandatoryEchoComplete = (reflectionId: string) => {
    completeMandatoryEcho(reflectionId);

    // Show coaching before exercises if first session
    if (isFirstSession() && !isCoachingStepSeen('afterEchoBeforeExercises')) {
      showCoaching('afterEchoBeforeExercises');
      return;
    }

    setCurrentView('exercises');
  };

  // Handle exercise completion
  const handleExerciseComplete = (exerciseId: string, response?: string) => {
    completeExercise(exerciseId, response);
  };

  // Handle all exercises done
  const handleExercisesComplete = () => {
    // Mark the daily practice as complete - this is critical!
    markDailyComplete();

    // Clear the session exercises state
    setExercisesForSession(null);
    setCompletedLessonInfo(null);

    // Show celebration coaching if first session
    if (isFirstSession() && !isCoachingStepSeen('afterFirstDayComplete')) {
      showCoaching('afterFirstDayComplete');
      // Will navigate to home when coaching is dismissed
      return;
    }

    // Show Spark unlock screen on first-ever daily completion
    if (!sparkUnlockSeen) {
      markSparkUnlockSeen();
      setCurrentView('spark-unlock');
      return;
    }

    setCurrentView('home');
  };

  // Handle Echo prompt response
  const handleEchoPromptAccept = () => {
    setShowEchoPrompt(false);
    markEchoPromptSeen();

    // Get a reflection to review (using the completed lesson's info)
    const reflection = completedLessonInfo
      ? getReflectionToReview(completedLessonInfo.id, completedLessonInfo.title)
      : getReflectionToReview('any', 'Growth Journey');

    if (reflection) {
      setReflectionForReview(reflection);
      setCurrentView('echo-review');
    } else {
      setCurrentView('home');
    }

    // Clear the completed lesson info
    setCompletedLessonInfo(null);
  };

  const handleEchoPromptDecline = () => {
    setShowEchoPrompt(false);
    markEchoPromptSeen();
    setCompletedLessonInfo(null);
    setCurrentView('home');
  };

  // Handle Echo review completion
  const handleEchoReviewComplete = () => {
    setReflectionForReview(null);
    setCurrentView('home');
  };

  const handleEchoReviewSkip = () => {
    setReflectionForReview(null);
    setCurrentView('home');
  };

  // Calculate total unread count for inbox
  const totalUnreadCount = getUnreadEchoCount() + getUnreadInvitationCount() + getUnreadMessageCount();

  // Wait for Zustand hydration to prevent flash of wrong screen on Android
  // Shows a blank screen matching the app background while state loads from localStorage
  if (!hydrated) {
    return (
      <div
        className="min-h-screen"
        style={{ background: '#050403' }}
        aria-hidden="true"
      />
    );
  }

  // Language selection - FIRST, before anything else
  if (!languageSelected) {
    return <LanguageSelector />;
  }

  // Onboarding flow
  if (!onboardingComplete) {
    return <OnboardingFlow />;
  }

  // Handle lesson dismiss (GoDoIt - user leaves to take action, no Echo prompt)
  const handleLessonDismiss = () => {
    setSelectedFlexibleLesson(null);
    setFlexibleLessonProgress(null);
    setCurrentView('home');
  };

  // Lesson mode selector - shown before lessons that have engagement paths
  if (currentView === 'lesson-mode-select' && selectedFlexibleLesson) {
    return (
      <>
        <AchievementCelebration />
        <LessonModeSelector
          lesson={selectedFlexibleLesson}
          onSelect={handleModeSelect}
        />
      </>
    );
  }

  // Lesson preview - cinematic intro before lesson starts
  if (currentView === 'lesson-preview' && selectedFlexibleLesson) {
    return (
      <>
        <AchievementCelebration />
        <LessonPreview
          lesson={selectedFlexibleLesson}
          mode={lessonMode}
          onStart={() => setCurrentView('lesson')}
          onBack={() => setCurrentView('home')}
        />
      </>
    );
  }

  // Lesson experience
  if (currentView === 'lesson' && selectedFlexibleLesson) {
    return (
      <>
        <AchievementCelebration />
        <FlexibleLessonExperience
          lesson={selectedFlexibleLesson}
          onComplete={handleLessonComplete}
          onDismiss={handleLessonDismiss}
          resumeProgress={flexibleLessonProgress || undefined}
          mode={lessonMode}
        />
      </>
    );
  }

  // Practice mode
  if (currentView === 'practice') {
    return (
      <>
        <AchievementCelebration />
        <PracticeMode
          onComplete={() => setCurrentView('home')}
          onExit={() => setCurrentView('home')}
        />
      </>
    );
  }

  // Weekly check-in
  if (currentView === 'checkin') {
    return (
      <>
        <AchievementCelebration />
        <WeeklyCheckin
          onComplete={() => setCurrentView('home')}
          onSkip={() => setCurrentView('home')}
        />
      </>
    );
  }

  // Monthly assessment
  if (currentView === 'assessment') {
    return (
      <>
        <AchievementCelebration />
        <MonthlyAssessment
          onComplete={() => setCurrentView('home')}
          onSkip={() => setCurrentView('home')}
        />
      </>
    );
  }

  // Transformation Hub
  if (currentView === 'transformation') {
    return (
      <>
        <AchievementCelebration />
        <TransformationHub
          onBack={() => setCurrentView('home')}
          onOpenAssessment={() => setCurrentView('assessment')}
        />
      </>
    );
  }

  // Echo Review - Reflecting on another's journey
  if (currentView === 'echo-review' && reflectionForReview) {
    return (
      <>
        <AchievementCelebration />
        <EchoReview
          reflection={reflectionForReview}
          onComplete={handleEchoReviewComplete}
          onSkip={handleEchoReviewSkip}
        />
      </>
    );
  }

  // Echoes Inbox - View received reflections, invitations, connections
  if (currentView === 'echoes') {
    return (
      <>
        <AchievementCelebration />
        <EchoInbox onClose={() => setCurrentView('home')} />
        <BottomNavBar
          activeTab="echoes"
          onTabChange={handleTabChange}
          isSparkUnlocked={dailyFlowState.currentPhase === 'complete'}
          unreadEchoCount={totalUnreadCount}
        />
      </>
    );
  }

  // Progress Dashboard (Phase 3)
  if (currentView === 'progress') {
    return (
      <>
        <AchievementCelebration />
        <ProgressDashboard
          onBack={() => setCurrentView('home')}
          onOpenAchievements={() => setCurrentView('achievements')}
          onOpenIdentity={() => setCurrentView('identity')}
          onOpenStory={handleOpenStory}
          onOpenDemoStory={handleOpenDemoStory}
        />
        {/* Story Modal */}
        <AnimatePresence>
          {activeStory && !showShareCard && (
            <TransformationStory
              story={activeStory}
              onClose={handleCloseStory}
              onShare={handleShareStory}
              onComplete={handleStoryComplete}
            />
          )}
          {activeStory && showShareCard && (
            <ShareableStoryCard
              card={activeStory.shareCard}
              onClose={handleCloseStory}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  // Achievement Gallery (Phase 3)
  if (currentView === 'achievements') {
    return (
      <>
        <AchievementCelebration />
        <AchievementGallery onBack={() => setCurrentView('home')} />
      </>
    );
  }

  // Identity Journey (Phase 3)
  if (currentView === 'identity') {
    return (
      <>
        <AchievementCelebration />
        <IdentityScreen onBack={() => setCurrentView('home')} />
      </>
    );
  }

  // World map - use active world
  if (currentView === 'map') {
    return (
      <>
        <AchievementCelebration />
        <WorldMap world={activeWorld} onSelectLesson={handleSelectLesson} />
        <BottomNavBar
          activeTab="journey"
          onTabChange={handleTabChange}
          isSparkUnlocked={dailyFlowState.currentPhase === 'complete'}
          unreadEchoCount={totalUnreadCount}
        />
      </>
    );
  }

  // Spark Unlock Screen - first-time celebration
  if (currentView === 'spark-unlock') {
    return (
      <SparkUnlockScreen
        onEnterSpark={() => setCurrentView('spark')}
        onSkip={() => setCurrentView('home')}
      />
    );
  }

  // Spark Feed - motivational shorts
  if (currentView === 'spark') {
    return (
      <SparkFeed onExit={() => setCurrentView('home')} />
    );
  }

  // Settings
  if (currentView === 'settings') {
    return (
      <>
        <AchievementCelebration />
        <SettingsPanel onBack={() => setCurrentView('home')} />
      </>
    );
  }

  // Dashboard - navigation hub (NEW REDESIGNED VERSION)
  if (currentView === 'dashboard') {
    const progressStats = getProgressStats();
    const latestIdentity = userIdentityStatements.length > 0
      ? userIdentityStatements[userIdentityStatements.length - 1]?.statement
      : undefined;

    return (
      <>
        <AchievementCelebration />
        <DashboardNew
          name={userName || 'Friend'}
          totalXp={totalXp}
          currentStreak={currentStreak}
          longestStreak={longestStreak}
          level={level}
          transformationGoal={transformationGoal || undefined}
          latestIdentityStatement={latestIdentity}
          todayLessonCompleted={dailyFlowState.canAccessEcho}
          todayEchoCompleted={dailyFlowState.canAccessPractice}
          exercisesCompleted={exercisesCompletedToday.length}
          totalExercises={todaysLesson?.exercises?.length || 5}
          todaysLessonTitle={todaysLesson?.title}
          currentWorld={activeWorld.name}
          dayInWorld={dayNumber}
          totalDaysInWorld={totalDaysInWorld}
          isWeeklyCheckinDue={isCheckinDue()}
          isMonthlyAssessmentDue={isAssessmentDue()}
          unreadEchoCount={totalUnreadCount}
          totalLessons={Object.keys(completedLessons).length}
          totalMilestones={progressStats.totalAchievements}
          identityStatements={progressStats.totalIdentityStatements}
          daysSinceStart={progressStats.daysSinceStart}
          onClose={() => setCurrentView('home')}
          onOpenTodayPractice={() => setCurrentView('home')}
          onOpenWeeklyCheckin={() => setCurrentView('checkin')}
          onOpenMonthlyAssessment={() => setCurrentView('assessment')}
          onOpenBrowseEchoes={() => setCurrentView('echoes')}
          onOpenYourEchoes={() => setCurrentView('echoes')}
          onOpenPastLessons={() => setCurrentView('map')}
          onOpenMilestones={() => setCurrentView('achievements')}
          onOpenIdentity={() => setCurrentView('identity')}
          onOpenStats={() => setCurrentView('progress')}
          onOpenSettings={() => setCurrentView('settings')}
          onOpenSpark={() => setCurrentView('spark')}
          isSparkUnlocked={dailyFlowState.currentPhase === 'complete'}
          isSparkForcedClosed={isSparkForcedClosed()}
        />
        <BottomNavBar
          activeTab="profile"
          onTabChange={handleTabChange}
          isSparkUnlocked={dailyFlowState.currentPhase === 'complete'}
          unreadEchoCount={totalUnreadCount}
        />
      </>
    );
  }

  // Mandatory Echo - after lesson completion, cannot skip
  if (currentView === 'mandatory-echo' && reflectionForReview) {
    return (
      <>
        <AchievementCelebration />
        <MandatoryEchoFlow
          reflection={reflectionForReview}
          todaysLessonTitle={completedLessonInfo?.title || todaysLesson?.title || ''}
          onComplete={handleMandatoryEchoComplete}
          skipIntroPhase={skipEchoIntro}
        />
        {/* Coaching modal must render in all views */}
        {coachingModal && (
          <CoachModal
            step={coachingModal}
            onDismiss={dismissCoaching}
            userName={userName || 'Friend'}
          />
        )}
      </>
    );
  }

  // Exercise experience - 5 exercises after echo
  // Use exercisesForSession (saved from completed lesson) as primary source,
  // fallback to todaysLesson.exercises
  const availableExercises = exercisesForSession || todaysLesson?.exercises;
  const exerciseLessonTitle = completedLessonInfo?.title || todaysLesson?.title || 'Practice';

  if (currentView === 'exercises') {
    // Check if we have exercises available
    if (availableExercises && availableExercises.length > 0) {
      return (
        <>
          <AchievementCelebration />
          <ExerciseExperience
            exercises={availableExercises}
            lessonTitle={exerciseLessonTitle}
            completedExercises={exercisesCompletedToday}
            onCompleteExercise={handleExerciseComplete}
            onAllComplete={handleExercisesComplete}
            onBack={() => setCurrentView('home')}
          />
          {/* Coaching modal must render in all views */}
          {coachingModal && (
            <CoachModal
              step={coachingModal}
              onDismiss={dismissCoaching}
              userName={userName || 'Friend'}
            />
          )}
        </>
      );
    } else {
      // No exercises available - mark complete and go home
      // This handles edge cases where exercises view is accessed without available exercises
      markDailyComplete();
      setCurrentView('home');
      return null;
    }
  }

  // Check for pending action to show "Continue" message
  const hasPendingAction = !!pendingAction;

  // Home - Daily Flow Home (new synchronized daily practice)
  return (
    <>
      <AchievementCelebration />
      <DailyFlowHome
        name={userName || 'Friend'}
        totalXp={totalXp}
        currentStreak={currentStreak}
        dayNumber={dayNumber}
        totalDays={totalDaysInWorld}
        worldName={activeWorld.name}
        todaysLesson={todaysLesson}
        tomorrowsLesson={tomorrowsLesson}
        flowState={dailyFlowState}
        exercisesCompleted={exercisesCompletedToday.length}
        totalExercises={todaysLesson?.exercises?.length || 5}
        hasPendingAction={hasPendingAction}
        pendingCommitment={pendingAction?.writings?.commitment}
        onStartLesson={handleStartLesson}
        onContinueLesson={handleStartLesson}
        onStartEcho={() => setCurrentView('mandatory-echo')}
        onStartExercises={() => setCurrentView('exercises')}
        onOpenSettings={() => setCurrentView('settings')}
        onBrowseMoreEchoes={() => setCurrentView('echoes')}
        onRedoPastLesson={() => setCurrentView('map')}
        onOpenDashboard={() => setCurrentView('dashboard')}
        onOpenSpark={() => setCurrentView('spark')}
        isSparkForcedClosed={isSparkForcedClosed()}
      />

      <BottomNavBar
        activeTab="home"
        onTabChange={handleTabChange}
        isSparkUnlocked={dailyFlowState.currentPhase === 'complete'}
        unreadEchoCount={totalUnreadCount}
      />

      {/* First-Session Coaching Modal */}
      {coachingModal && (
        <CoachModal
          step={coachingModal}
          onDismiss={dismissCoaching}
          userName={userName || 'Friend'}
        />
      )}

      {/* Global Auth Modals — accessible from any home-level component */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToSignup={() => { setShowLogin(false); setShowSignup(true); }}
      />
      <SignupModal
        isOpen={showSignup}
        onClose={() => setShowSignup(false)}
        onSwitchToLogin={() => { setShowSignup(false); setShowLogin(true); }}
      />
    </>
  );
}
