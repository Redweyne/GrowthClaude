'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { getLevelFromXp, getXpProgress } from '@/types';
import type { DisplayLesson, DisplayWorld } from '@/types';

// Import our breathtaking new components
import { AmbientBackground } from '@/components/ambient';
import { HeroGreeting } from './HeroGreeting';
import { LevelDisplay } from './LevelDisplay';
import { LessonCard } from './LessonCard';
import { NavigationGrid } from './NavigationGrid';
import { StatusBanner } from './StatusBanner';

// ═══════════════════════════════════════════════════════════════════════════
// TODAY'S LESSON - THE HOME EXPERIENCE
// The heart of Transformation Hub - where users begin their daily journey
// A carefully orchestrated symphony of components creating an immersive,
// breathtaking experience that hooks users from the first moment
// ═══════════════════════════════════════════════════════════════════════════

interface TodaysLessonProps {
  lesson: DisplayLesson | null;
  world: DisplayWorld;
  onStartLesson: () => void;
  onOpenMap: () => void;
  onOpenSettings: () => void;
  onOpenPractice: () => void;
  onOpenCheckin: () => void;
  onOpenAssessment: () => void;
  onOpenTransformation: () => void;
  onOpenProgress: () => void;
  onOpenAchievements: () => void;
  onOpenIdentity: () => void;
  onOpenWorlds: () => void;
  onOpenEchoes?: () => void;
  isCheckinDue: boolean;
  isAssessmentDue: boolean;
  unreadEchoCount?: number;
  hasPendingAction?: boolean;
  pendingCommitment?: string;
}

export function TodaysLesson({
  lesson,
  world,
  onStartLesson,
  onOpenMap,
  onOpenSettings,
  onOpenPractice,
  onOpenCheckin,
  onOpenAssessment,
  onOpenTransformation,
  onOpenProgress,
  onOpenAchievements,
  onOpenIdentity,
  onOpenWorlds,
  onOpenEchoes,
  isCheckinDue,
  isAssessmentDue,
  unreadEchoCount = 0,
  hasPendingAction = false,
  pendingCommitment,
}: TodaysLessonProps) {
  // Get user state
  const { name, totalXp, currentStreak, longestStreak, completedLessons, lastLessonDate, transformationGoal, streakShieldCount } = useStore();

  // Calculate level and progress
  const level = getLevelFromXp(totalXp);
  const xpProgress = getXpProgress(totalXp);

  // Calculate world progress
  const allLessons = world.chapters.flatMap((ch) => ch.lessons);
  const completedCount = allLessons.filter((l) => completedLessons[l.id]).length;
  const totalCount = allLessons.length;

  // Feature availability
  const hasPracticeAvailable = completedCount > 0;
  const hasTransformationAvailable = completedCount >= 1;

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Ambient background - time-aware atmospheric effects */}
      <AmbientBackground intensity="normal" particleCount={15} orbCount={3} />

      {/* Main content container */}
      <motion.div
        className="relative z-10 flex-1 flex flex-col p-6 max-w-lg mx-auto w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero greeting section */}
        <HeroGreeting
          name={name || 'Seeker'}
          streak={currentStreak}
          longestStreak={longestStreak}
          totalLessons={Object.keys(completedLessons).length}
          lastLessonDate={lastLessonDate}
          transformationGoal={transformationGoal}
          streakShieldCount={streakShieldCount}
          onOpenSettings={onOpenSettings}
        />

        {/* Level and XP display */}
        <div className="mb-8">
          <LevelDisplay
            level={level}
            totalXp={totalXp}
            xpProgress={xpProgress}
          />
        </div>

        {/* Status banners - Check-in and Assessment prompts */}
        <AnimatePresence>
          {(isCheckinDue || isAssessmentDue) && (
            <motion.div
              className="space-y-3 mb-8"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {isCheckinDue && (
                <StatusBanner variant="checkin" onClick={onOpenCheckin} />
              )}
              {isAssessmentDue && (
                <StatusBanner variant="assessment" onClick={onOpenAssessment} />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main lesson card - the centerpiece */}
        <div className="flex-1 flex flex-col justify-center py-4">
          <LessonCard
            lesson={lesson}
            world={world}
            onStartLesson={onStartLesson}
            completedCount={completedCount}
            totalCount={totalCount}
            hasPendingAction={hasPendingAction}
            pendingCommitment={pendingCommitment}
          />
        </div>

        {/* Bottom navigation grid */}
        <NavigationGrid
          onOpenProgress={onOpenProgress}
          onOpenAchievements={onOpenAchievements}
          onOpenIdentity={onOpenIdentity}
          onOpenPractice={onOpenPractice}
          onOpenMap={onOpenMap}
          onOpenTransformation={onOpenTransformation}
          onOpenWorlds={onOpenWorlds}
          onOpenEchoes={onOpenEchoes}
          streak={currentStreak}
          hasPracticeAvailable={hasPracticeAvailable}
          hasTransformationAvailable={hasTransformationAvailable}
          unreadEchoCount={unreadEchoCount}
        />
      </motion.div>
    </div>
  );
}

export default TodaysLesson;
