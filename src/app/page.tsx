'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { TodaysLesson } from '@/components/home/TodaysLesson';
import { WorldMap } from '@/components/world/WorldMap';
import { LessonExperience } from '@/components/lesson/LessonExperience';
import { PracticeMode } from '@/components/practice';
import { WeeklyCheckin } from '@/components/checkin';
import { MonthlyAssessment } from '@/components/assessment';
import { TransformationHub } from '@/components/transformation';
import stoicismWorld from '@/content/stoicism';

type AppView = 'home' | 'map' | 'lesson' | 'practice' | 'checkin' | 'assessment' | 'transformation' | 'settings';

export default function Home() {
  const { onboardingComplete, completedLessons, isCheckinDue, isAssessmentDue } = useStore();
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  // Get current world (for MVP, just Stoicism)
  const currentWorld = stoicismWorld;

  // Find the next incomplete lesson
  const getNextLesson = () => {
    for (const chapter of currentWorld.chapters) {
      for (const lesson of chapter.lessons) {
        if (!completedLessons[lesson.id]) {
          return lesson;
        }
      }
    }
    return null;
  };

  // Get a specific lesson by ID
  const getLessonById = (id: string) => {
    for (const chapter of currentWorld.chapters) {
      for (const lesson of chapter.lessons) {
        if (lesson.id === id) {
          return lesson;
        }
      }
    }
    return null;
  };

  const nextLesson = getNextLesson();
  const selectedLesson = selectedLessonId ? getLessonById(selectedLessonId) : null;

  // Handle lesson start from home
  const handleStartLesson = () => {
    if (nextLesson) {
      setSelectedLessonId(nextLesson.id);
      setCurrentView('lesson');
    }
  };

  // Handle lesson select from map
  const handleSelectLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setCurrentView('lesson');
  };

  // Handle lesson completion
  const handleLessonComplete = () => {
    setSelectedLessonId(null);
    setCurrentView('home');
  };

  // Onboarding flow
  if (!onboardingComplete) {
    return <OnboardingFlow />;
  }

  // Lesson experience
  if (currentView === 'lesson' && selectedLesson) {
    return (
      <LessonExperience
        lesson={selectedLesson}
        onComplete={handleLessonComplete}
      />
    );
  }

  // Practice mode
  if (currentView === 'practice') {
    return (
      <PracticeMode
        onComplete={() => setCurrentView('home')}
        onExit={() => setCurrentView('home')}
      />
    );
  }

  // Weekly check-in
  if (currentView === 'checkin') {
    return (
      <WeeklyCheckin
        onComplete={() => setCurrentView('home')}
        onSkip={() => setCurrentView('home')}
      />
    );
  }

  // Monthly assessment
  if (currentView === 'assessment') {
    return (
      <MonthlyAssessment
        onComplete={() => setCurrentView('home')}
        onSkip={() => setCurrentView('home')}
      />
    );
  }

  // Transformation Hub
  if (currentView === 'transformation') {
    return (
      <TransformationHub
        onBack={() => setCurrentView('home')}
        onOpenAssessment={() => setCurrentView('assessment')}
      />
    );
  }

  // World map
  if (currentView === 'map') {
    return (
      <div>
        <button
          onClick={() => setCurrentView('home')}
          className="fixed top-4 left-4 z-50 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors text-sm"
        >
          ← Back
        </button>
        <WorldMap world={currentWorld} onSelectLesson={handleSelectLesson} />
      </div>
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

  // Home - Today's Lesson
  return (
    <TodaysLesson
      lesson={nextLesson}
      world={currentWorld}
      onStartLesson={handleStartLesson}
      onOpenMap={() => setCurrentView('map')}
      onOpenSettings={() => setCurrentView('settings')}
      onOpenPractice={() => setCurrentView('practice')}
      onOpenCheckin={() => setCurrentView('checkin')}
      onOpenAssessment={() => setCurrentView('assessment')}
      onOpenTransformation={() => setCurrentView('transformation')}
      isCheckinDue={isCheckinDue()}
      isAssessmentDue={isAssessmentDue()}
    />
  );
}
