'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { TodaysLesson } from '@/components/home/TodaysLesson';
import { WorldMap } from '@/components/world/WorldMap';
import { FlexibleLessonExperience } from '@/components/lesson/FlexibleLessonExperience';
import { PracticeMode } from '@/components/practice';
import { WeeklyCheckin } from '@/components/checkin';
import { MonthlyAssessment } from '@/components/assessment';
import { TransformationHub } from '@/components/transformation';
import { ProgressDashboard } from '@/components/progress';
import { AchievementGallery, AchievementCelebration } from '@/components/achievements';
import { IdentityScreen } from '@/components/identity';
import { TransformationStory, ShareableStoryCard } from '@/components/story';
import { useTransformationStory } from '@/hooks';
import { TransformationStory as TransformationStoryType } from '@/types/story';
import modernWisdomWorld from '@/content/modernWisdom';
import type { FlexibleLesson, LessonProgress } from '@/types/lessons';

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
  | 'settings';

export default function Home() {
  const { onboardingComplete, completedLessons, isCheckinDue, isAssessmentDue, getPendingLessonAction } = useStore();
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedFlexibleLesson, setSelectedFlexibleLesson] = useState<FlexibleLesson | null>(null);
  const [flexibleLessonProgress, setFlexibleLessonProgress] = useState<LessonProgress | null>(null);

  // Story state
  const [activeStory, setActiveStory] = useState<TransformationStoryType | null>(null);
  const [showShareCard, setShowShareCard] = useState(false);
  const { generateStory, canGenerateStory } = useTransformationStory();

  // Handle opening the story
  const handleOpenStory = useCallback(() => {
    if (!canGenerateStory) return;
    const story = generateStory('on_demand');
    if (story) {
      setActiveStory(story);
    }
  }, [canGenerateStory, generateStory]);

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

  // Modern Wisdom world
  const modernWorld = modernWisdomWorld;

  // Find the next incomplete lesson from Modern Wisdom
  const getNextFlexibleLesson = (): FlexibleLesson | null => {
    for (const chapter of modernWorld.chapters) {
      for (const lesson of chapter.lessons) {
        if (!completedLessons[lesson.id]) {
          return lesson;
        }
      }
    }
    return null;
  };

  // Get a flexible lesson by ID
  const getFlexibleLessonById = (id: string): FlexibleLesson | null => {
    for (const chapter of modernWorld.chapters) {
      for (const lesson of chapter.lessons) {
        if (lesson.id === id) {
          return lesson;
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

    // Start next lesson from Modern Wisdom
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
    setSelectedFlexibleLesson(null);
    setFlexibleLessonProgress(null);
    setCurrentView('home');
  };

  // Onboarding flow
  if (!onboardingComplete) {
    return <OnboardingFlow />;
  }

  // Lesson experience
  if (currentView === 'lesson' && selectedFlexibleLesson) {
    return (
      <>
        <AchievementCelebration />
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

  // World map - use Modern Wisdom
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
          <WorldMap world={modernWorld} onSelectLesson={handleSelectLesson} />
        </div>
      </>
    );
  }

  // Settings (simple placeholder for now)
  if (currentView === 'settings') {
    return (
      <div className="min-h-screen bg-zinc-950 p-6">
        <button
          onClick={() => setCurrentView('home')}
          className="mb-8 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors text-sm"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-white mb-4">Settings</h1>
        <p className="text-zinc-400">Settings coming soon...</p>
      </div>
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

  // Use Modern Wisdom world directly for home screen display
  // This ensures progress is calculated from Modern Wisdom lessons
  const displayWorld = {
    name: modernWorld.name,
    subtitle: modernWorld.subtitle,
    color: modernWorld.color,
    chapters: modernWorld.chapters,
  };

  // Check for pending action to show "Continue" message
  const hasPendingAction = !!pendingAction;

  // Home - Today's Lesson
  return (
    <>
      <AchievementCelebration />
      <TodaysLesson
        lesson={displayLesson}
        world={hasPendingAction ? { ...displayWorld, subtitle: 'You have an action to complete!' } : displayWorld}
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
        isCheckinDue={isCheckinDue()}
        isAssessmentDue={isAssessmentDue()}
      />
    </>
  );
}
