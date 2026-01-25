'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { useEchoesStore } from '@/store/useEchoesStore';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { TodaysLesson } from '@/components/home/TodaysLesson';
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
import { TransformationStory as TransformationStoryType } from '@/types/story';
import type { PublicReflection } from '@/types/echoes';
import modernWisdomWorld from '@/content/modernWisdom';
import stoicismWorld from '@/content/stoicismModern';
import type { FlexibleLesson, LessonProgress, FlexibleWorld } from '@/types/lessons';

type AppView =
  | 'home'
  | 'map'
  | 'lesson'
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
    onboardingComplete,
    completedLessons,
    isCheckinDue,
    isAssessmentDue,
    getPendingLessonAction,
    currentWorldSlug: storedWorldSlug,
    setCurrentWorld
  } = useStore();
  const {
    shouldShowEchoPrompt,
    markEchoPromptSeen,
    getReflectionToReview,
    getUnreadEchoCount,
    getUnreadInvitationCount,
    getUnreadMessageCount
  } = useEchoesStore();

  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedFlexibleLesson, setSelectedFlexibleLesson] = useState<FlexibleLesson | null>(null);
  const [flexibleLessonProgress, setFlexibleLessonProgress] = useState<LessonProgress | null>(null);

  // Echoes state
  const [showEchoPrompt, setShowEchoPrompt] = useState(false);
  const [reflectionForReview, setReflectionForReview] = useState<PublicReflection | null>(null);
  const [completedLessonInfo, setCompletedLessonInfo] = useState<{ id: string; title: string } | null>(null);

  // Story state
  const [activeStory, setActiveStory] = useState<TransformationStoryType | null>(null);
  const [showShareCard, setShowShareCard] = useState(false);
  const { generateStory, canGenerateStory, generateDemoStory } = useTransformationStory();

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

  // Handle lesson start from home
  const handleStartLesson = () => {
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

  // Handle lesson completion
  const handleLessonComplete = () => {
    // Save completed lesson info for Echo prompt
    if (selectedFlexibleLesson) {
      setCompletedLessonInfo({
        id: selectedFlexibleLesson.id,
        title: selectedFlexibleLesson.title,
      });
    }

    setSelectedFlexibleLesson(null);
    setFlexibleLessonProgress(null);

    // Check if we should show the Echo prompt
    if (shouldShowEchoPrompt()) {
      setShowEchoPrompt(true);
    } else {
      setCurrentView('home');
    }
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

  // Create display lesson for home screen (minimal properties needed)
  const displayLesson = nextFlexibleLesson ? {
    id: nextFlexibleLesson.id,
    title: nextFlexibleLesson.title,
    wisdomText: nextFlexibleLesson.subtitle || 'Begin your transformation',
    xpReward: nextFlexibleLesson.xpReward,
    actionDurationSeconds: 180, // ~3 min for flexible lessons
  } : null;

  // Use active world for home screen display
  const displayWorld = {
    name: activeWorld.name,
    subtitle: activeWorld.subtitle,
    color: activeWorld.color,
    chapters: activeWorld.chapters,
  };

  // Check for pending action to show "Continue" message
  const hasPendingAction = !!pendingAction;

  // Home - Today's Lesson
  return (
    <>
      <AchievementCelebration />
      <TodaysLesson
        lesson={displayLesson}
        world={displayWorld}
        onStartLesson={handleStartLesson}
        onOpenMap={() => setCurrentView('map')}
        onOpenSettings={() => setCurrentView('settings')}
        onOpenPractice={() => setCurrentView('practice')}
        onOpenCheckin={() => setCurrentView('checkin')}
        onOpenAssessment={() => setCurrentView('assessment')}
        onOpenTransformation={() => setCurrentView('transformation')}
        onOpenProgress={() => setCurrentView('progress')}
        onOpenAchievements={() => setCurrentView('achievements')}
        onOpenIdentity={() => setCurrentView('identity')}
        onOpenWorlds={() => setShowWorldSwitcher(true)}
        onOpenEchoes={() => setCurrentView('echoes')}
        isCheckinDue={isCheckinDue()}
        isAssessmentDue={isAssessmentDue()}
        unreadEchoCount={totalUnreadCount}
        hasPendingAction={hasPendingAction}
        pendingCommitment={pendingAction?.writings?.commitment}
      />

      {/* World Switcher Modal */}
      <AnimatePresence>
        {showWorldSwitcher && (
          <WorldSwitcher
            worlds={allWorlds}
            currentWorldSlug={currentWorldSlug}
            onSelectWorld={setCurrentWorld}
            onClose={() => setShowWorldSwitcher(false)}
          />
        )}
      </AnimatePresence>

      {/* Echo Prompt Modal - appears after lesson completion */}
      <AnimatePresence>
        {showEchoPrompt && (
          <EchoPrompt
            onAccept={handleEchoPromptAccept}
            onDecline={handleEchoPromptDecline}
          />
        )}
      </AnimatePresence>
    </>
  );
}
