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
import { IdentityScreen } from '@/components/identity';
import { TransformationStory, ShareableStoryCard } from '@/components/story';
import { EchoPrompt, EchoReview, EchoInbox } from '@/components/echoes';
import { SettingsPanel } from '@/components/settings';
import { useTransformationStory } from '@/hooks';
import { TransformationStory as TransformationStoryType } from '@/types/story';
import { getLevelFromXp } from '@/types';
import type { PublicReflection } from '@/types/echoes';
import { getModernWisdomWorld } from '@/content/modernWisdom';
import { useTranslation } from '@/i18n';
import type { FlexibleLesson, LessonProgress, FlexibleWorld } from '@/types/lessons';
import { SparkFeed, SparkUnlockScreen } from '@/components/spark';
import { DailyTasksView } from '@/components/tasks';
import { useSparkStore } from '@/store/useSparkStore';
import { BottomNavBar, type NavTab } from '@/components/navigation/BottomNavBar';
import { backgroundMusic } from '@/lib/backgroundMusic';
import { useActivityLog } from '@/providers/ActivityLoggerProvider';
import { WorldsPage } from '@/components/worlds/WorldsPage';

type AppView =
  | 'home'
  | 'dashboard'
  | 'map'
  | 'lesson'
  | 'lesson-preview'
  | 'mandatory-echo'
  | 'exercises'
  | 'practice'
  | 'checkin'
  | 'assessment'
  | 'transformation'
  | 'progress'
  | 'identity'
  | 'settings'
  | 'worldSwitcher'
  | 'echoes'
  | 'echo-review'
  | 'tasks'
  | 'worlds'
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
  const copy = {
    en: {
      worldsTitle: 'Your Journey',
      worldsSubtitle: 'Choose the world you wish to grow in next',
      continueJourney: 'Continue Journey',
      comingSoon: 'Coming Soon',
      locked: 'Locked',
      lessons: 'Lessons',
      friend: 'Friend',
      practiceFallback: 'Practice',
      growthJourney: 'Growth Journey',
    },
    fr: {
      worldsTitle: 'Votre Voyage',
      worldsSubtitle: 'Choisissez le monde dans lequel vous souhaitez grandir',
      continueJourney: 'Continuer le voyage',
      comingSoon: 'Bientôt disponible',
      locked: 'Verrouillé',
      lessons: 'Leçons',
      friend: 'Ami',
      practiceFallback: 'Pratique',
      growthJourney: 'Parcours de croissance',
    },
    ar: {
      worldsTitle: 'رحلتك',
      worldsSubtitle: 'اختر العالم الذي تريد أن تنمو فيه',
      continueJourney: 'متابعة الرحلة',
      comingSoon: 'قريباً',
      locked: 'مقفل',
      lessons: 'دروس',
      friend: 'صديق',
      practiceFallback: 'ممارسة',
      growthJourney: 'رحلة النمو',
    },
  } as const;
  const c = copy[locale] ?? copy.en;
  const { logEvent, trackView } = useActivityLog();

  const [currentView, setCurrentView] = useState<AppView>('home');
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [selectedFlexibleLesson, setSelectedFlexibleLesson] = useState<FlexibleLesson | null>(null);
  const [flexibleLessonProgress, setFlexibleLessonProgress] = useState<LessonProgress | null>(null);

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
      // Onboarding just completed - stop sound effects but NOT background music.
      // Background music should continue seamlessly from onboarding into the app.
      // It will be stopped naturally when the user navigates away from lesson view.
    }
    prevOnboardingCompleteRef.current = onboardingComplete;
  }, [onboardingComplete]);

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
          setFlexibleLessonProgress({
            lessonId: inProgress.lessonId,
            currentStepId: inProgress.currentStepId,
            choices: inProgress.choices,
            writings: inProgress.writings,
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

  // ─── Activity Logging: log lesson start ──────────────────────
  useEffect(() => {
    if (currentView === 'lesson' && selectedFlexibleLesson) {
      logEvent('lesson_started', {
        lessonId: selectedFlexibleLesson.id,
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
      case 'worlds': setCurrentView('worlds'); break;
      case 'tasks': setCurrentView('tasks'); break;
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

  const nextFlexibleLesson = getNextFlexibleLesson();

  // Dismiss coaching modal and navigate appropriately
  const dismissCoaching = useCallback(() => {
    if (coachingModal) {
      const currentStep = coachingModal;
      markCoachingStepSeen(currentStep);
      setCoachingModal(null);

      switch (currentStep) {
        case 'beforeFirstLesson':
          if (nextFlexibleLesson) {
            setSelectedFlexibleLesson(nextFlexibleLesson);
            setFlexibleLessonProgress(null);
            setCurrentView('lesson');
          }
          break;
        case 'afterLessonBeforeEcho':
          setCurrentView('mandatory-echo');
          break;
        case 'afterEchoBeforeExercises':
          setCurrentView('exercises');
          break;
        case 'afterFirstDayComplete':
          completeFirstSession();
          setCurrentView('home');
          break;
      }
    }
  }, [coachingModal, markCoachingStepSeen, completeFirstSession, nextFlexibleLesson]);

  // Handle lesson start from home
  const handleStartLesson = () => {
    const lessonCount = Object.keys(completedLessons).length;
    if (lessonCount === 0 && isFirstSession() && !isCoachingStepSeen('beforeFirstLesson')) {
      showCoaching('beforeFirstLesson');
      return;
    }

    if (nextFlexibleLesson) {
      setSelectedFlexibleLesson(nextFlexibleLesson);
      setFlexibleLessonProgress(null);
      setCurrentView('lesson');
    }
  };

  // Handle lesson select from map (including redo)
  // Validates that the lesson is actually accessible (all prior lessons completed)
  const handleSelectLesson = (lessonId: string) => {
    const lesson = getFlexibleLessonById(lessonId);
    if (!lesson) return;

    // Verify lesson accessibility — find it in the world and check all prior lessons
    const allLessons = allWorlds.flatMap(w => w.chapters.flatMap(ch => ch.lessons));
    const lessonIndex = allLessons.findIndex(l => l.id === lessonId);
    if (lessonIndex > 0) {
      for (let i = 0; i < lessonIndex; i++) {
        if (!completedLessons[allLessons[i].id]) return; // Prior lesson not done — block
      }
    }

    setSelectedFlexibleLesson(lesson);
    setFlexibleLessonProgress(null);
    setCurrentView('lesson');
  };


  // Handle lesson completion - now goes to mandatory echo
  const handleLessonComplete = () => {
    // Stop background music when leaving the lesson
    // Only stop music — don't kill all audio, as celebration sounds may still be playing
    backgroundMusic.stop();

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
      : getReflectionToReview('any', c.growthJourney);

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

  // Lesson preview - cinematic intro before lesson starts
  if (currentView === 'lesson-preview' && selectedFlexibleLesson) {
    return (
      <>
        <LessonPreview
          lesson={selectedFlexibleLesson}
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
        <FlexibleLessonExperience
          lesson={selectedFlexibleLesson}
          onComplete={handleLessonComplete}
          resumeProgress={flexibleLessonProgress || undefined}
        />
      </>
    );
  }

  // Practice mode
  if (currentView === 'practice') {
    return (
      <>
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
        <EchoReview
          reflection={reflectionForReview}
          onComplete={handleEchoReviewComplete}
          onSkip={handleEchoReviewSkip}
        />
      </>
    );
  }

  // Worlds — world selection page
  if (currentView === 'worlds') {
    return (
      <div className="h-[100dvh] flex flex-col overflow-hidden bg-[#020106]">
        <WorldsPage
          locale={locale}
          completedLessons={completedLessons}
          onContinueJourney={() => setCurrentView('map')}
          copy={{
            title: c.worldsTitle,
            subtitle: c.worldsSubtitle,
            continueJourney: c.continueJourney,
            comingSoon: c.comingSoon,
            locked: c.locked,
            lessons: c.lessons,
          }}
        />
        <BottomNavBar
          activeTab="worlds"
          onTabChange={handleTabChange}
          isSparkUnlocked={dailyFlowState.currentPhase === 'complete'}
          unreadEchoCount={totalUnreadCount}
        />
      </div>
    );
  }

  // Daily Tasks - Scratch & Conquer
  if (currentView === 'tasks') {
    return (
      <div className="h-[100dvh] flex flex-col overflow-hidden">
        <main className="flex-1 min-h-0">
          <DailyTasksView />
        </main>
        <BottomNavBar
          activeTab="tasks"
          onTabChange={handleTabChange}
          isSparkUnlocked={dailyFlowState.currentPhase === 'complete'}
          unreadEchoCount={totalUnreadCount}
        />
      </div>
    );
  }

  // Echoes Inbox - View received reflections, invitations, connections
  if (currentView === 'echoes') {
    return (
      <div className="h-[100dvh] flex flex-col overflow-hidden">
        <main className="flex-1 min-h-0">
          <EchoInbox onClose={() => setCurrentView('home')} />
        </main>
        <BottomNavBar
          activeTab="echoes"
          onTabChange={handleTabChange}
          isSparkUnlocked={dailyFlowState.currentPhase === 'complete'}
          unreadEchoCount={totalUnreadCount}
        />
      </div>
    );
  }

  // Progress Dashboard (Phase 3)
  if (currentView === 'progress') {
    return (
      <>
        <ProgressDashboard
          onBack={() => setCurrentView('home')}
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

  // Identity Journey (Phase 3)
  if (currentView === 'identity') {
    return (
      <>
        <IdentityScreen onBack={() => setCurrentView('home')} />
      </>
    );
  }

  // World map - use active world
  if (currentView === 'map') {
    return (
      <div className="h-[100dvh] flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto overscroll-contain">
          <WorldMap world={activeWorld} onSelectLesson={handleSelectLesson} />
        </main>
        <BottomNavBar
          activeTab="journey"
          onTabChange={handleTabChange}
          isSparkUnlocked={dailyFlowState.currentPhase === 'complete'}
          unreadEchoCount={totalUnreadCount}
        />
      </div>
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
      <div className="h-[100dvh] flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto overscroll-contain">
          <DashboardNew
            name={userName || c.friend}
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
            identityStatements={progressStats.totalIdentityStatements}
            daysSinceStart={progressStats.daysSinceStart}
            onClose={() => setCurrentView('home')}
            onOpenTodayPractice={() => setCurrentView('home')}
            onOpenWeeklyCheckin={() => setCurrentView('checkin')}
            onOpenMonthlyAssessment={() => setCurrentView('assessment')}
            onOpenBrowseEchoes={() => setCurrentView('echoes')}
            onOpenYourEchoes={() => setCurrentView('echoes')}
            onOpenPastLessons={() => setCurrentView('map')}
            onOpenIdentity={() => setCurrentView('identity')}
            onOpenStats={() => setCurrentView('progress')}
            onOpenSettings={() => setCurrentView('settings')}
            onOpenSpark={() => setCurrentView('spark')}
            isSparkUnlocked={dailyFlowState.currentPhase === 'complete'}
            isSparkForcedClosed={isSparkForcedClosed()}
          />
        </main>
        <BottomNavBar
          activeTab="profile"
          onTabChange={handleTabChange}
          isSparkUnlocked={dailyFlowState.currentPhase === 'complete'}
          unreadEchoCount={totalUnreadCount}
        />
      </div>
    );
  }

  // Mandatory Echo - after lesson completion, cannot skip
  if (currentView === 'mandatory-echo' && reflectionForReview) {
    return (
      <>
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
            userName={userName || c.friend}
          />
        )}
      </>
    );
  }

  // Exercise experience - 5 exercises after echo
  // Use exercisesForSession (saved from completed lesson) as primary source,
  // fallback to todaysLesson.exercises
  const availableExercises = exercisesForSession || todaysLesson?.exercises;
  const exerciseLessonTitle = completedLessonInfo?.title || todaysLesson?.title || c.practiceFallback;

  if (currentView === 'exercises') {
    // Check if we have exercises available
    if (availableExercises && availableExercises.length > 0) {
      return (
        <>
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
              userName={userName || c.friend}
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

  const hasPendingAction = false;

  // Home - Daily Flow Home (new synchronized daily practice)
  return (
    <>
      <div className="h-[100dvh] flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto overscroll-contain">
          <DailyFlowHome
            name={userName || c.friend}
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
            pendingCommitment={undefined}
            latestIdentityStatement={userIdentityStatements.length > 0 ? userIdentityStatements[userIdentityStatements.length - 1]?.statement : undefined}
            totalLessonsCompleted={Object.keys(completedLessons).length}
            daysSinceStart={getProgressStats().daysSinceStart}
            longestStreak={longestStreak}
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
        </main>

        <BottomNavBar
          activeTab="home"
          onTabChange={handleTabChange}
          isSparkUnlocked={dailyFlowState.currentPhase === 'complete'}
          unreadEchoCount={totalUnreadCount}
        />
      </div>

      {/* First-Session Coaching Modal */}
      {coachingModal && (
        <CoachModal
          step={coachingModal}
          onDismiss={dismissCoaching}
          userName={userName || c.friend}
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
