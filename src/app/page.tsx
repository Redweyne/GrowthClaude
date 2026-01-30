'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
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
import { ExerciseExperience } from '@/components/exercises/ExerciseExperience';
import { WorldMap, WorldSwitcher } from '@/components/world';
import { FlexibleLessonExperience } from '@/components/lesson/FlexibleLessonExperience';
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
import modernWisdomWorld from '@/content/modernWisdom';
import stoicismWorld from '@/content/stoicismModern';
import type { FlexibleLesson, LessonProgress, FlexibleWorld } from '@/types/lessons';

type AppView =
  | 'home'
  | 'dashboard'
  | 'map'
  | 'lesson'
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
  | 'echo-review';

export default function Home() {
  const {
    languageSelected,
    onboardingComplete,
    completedLessons,
    isCheckinDue,
    isAssessmentDue,
    getPendingLessonAction,
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

  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedFlexibleLesson, setSelectedFlexibleLesson] = useState<FlexibleLesson | null>(null);
  const [flexibleLessonProgress, setFlexibleLessonProgress] = useState<LessonProgress | null>(null);

  // Echoes state
  const [showEchoPrompt, setShowEchoPrompt] = useState(false);
  const [reflectionForReview, setReflectionForReview] = useState<PublicReflection | null>(null);
  const [completedLessonInfo, setCompletedLessonInfo] = useState<{ id: string; title: string } | null>(null);
  const [skipEchoIntro, setSkipEchoIntro] = useState(false); // Track if coaching was shown to skip echo intro

  // Story state
  const [activeStory, setActiveStory] = useState<TransformationStoryType | null>(null);
  const [showShareCard, setShowShareCard] = useState(false);
  const { generateStory, canGenerateStory, generateDemoStory } = useTransformationStory();
  const { stopMusic, stopAmbience } = useAudio();
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
      stopMusic(0.1);
      stopAmbience();
    }
    prevOnboardingCompleteRef.current = onboardingComplete;
  }, [onboardingComplete, stopMusic, stopAmbience]);

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
  const allWorlds: FlexibleWorld[] = [modernWisdomWorld, stoicismWorld];

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

  // Dismiss coaching modal and navigate appropriately
  const dismissCoaching = useCallback(() => {
    if (coachingModal) {
      const currentStep = coachingModal;
      markCoachingStepSeen(currentStep);
      setCoachingModal(null);

      // Navigate based on which coaching step was dismissed
      switch (currentStep) {
        case 'beforeFirstLesson':
          // Now actually start the lesson
          if (nextFlexibleLesson) {
            setSelectedFlexibleLesson(nextFlexibleLesson);
            setFlexibleLessonProgress(null);
            setCurrentView('lesson');
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
    if (pendingAction) {
      const lesson = getFlexibleLessonById(pendingAction.lessonId);
      if (lesson) {
        setSelectedFlexibleLesson(lesson);
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
      setCurrentView('lesson');
    }
  };


  // Handle lesson select from map
  const handleSelectLesson = (lessonId: string) => {
    const lesson = getFlexibleLessonById(lessonId);
    if (lesson) {
      setSelectedFlexibleLesson(lesson);
      setFlexibleLessonProgress(null);
      setCurrentView('lesson');
    }
  };

  // Handle lesson completion - now goes to mandatory echo
  const handleLessonComplete = () => {
    // Save completed lesson info for Echo prompt
    if (selectedFlexibleLesson) {
      setCompletedLessonInfo({
        id: selectedFlexibleLesson.id,
        title: selectedFlexibleLesson.title,
      });
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

    // Show celebration coaching if first session
    if (isFirstSession() && !isCoachingStepSeen('afterFirstDayComplete')) {
      showCoaching('afterFirstDayComplete');
      // Will navigate to home when coaching is dismissed
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
        <div>
          <button
            onClick={() => setCurrentView('home')}
            className="fixed top-4 left-4 z-50 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors text-sm"
          >
            ← Back
          </button>
          <WorldMap world={activeWorld} onSelectLesson={handleSelectLesson} />
        </div>
      </>
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
      </>
    );
  }

  // Exercise experience - 5 exercises after echo
  if (currentView === 'exercises' && todaysLesson?.exercises) {
    return (
      <>
        <AchievementCelebration />
        <ExerciseExperience
          exercises={todaysLesson.exercises}
          lessonTitle={todaysLesson.title}
          completedExercises={exercisesCompletedToday}
          onCompleteExercise={handleExerciseComplete}
          onAllComplete={handleExercisesComplete}
          onBack={() => setCurrentView('home')}
        />
      </>
    );
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
      />

      {/* First-Session Coaching Modal */}
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
