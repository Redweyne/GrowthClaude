'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Heart, Dumbbell, ChevronRight, Settings, Lock, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AmbientBackground } from '@/components/ambient';
import { HeroGreeting } from '@/components/home/HeroGreeting';
import { LevelDisplay } from '@/components/home/LevelDisplay';
import { getLevelFromXp, getXpProgress } from '@/types';
import type { FlexibleLesson } from '@/types/lessons';
import type { DailyFlowState } from '@/types/dailyPractice';

// ═══════════════════════════════════════════════════════════════════════════
// DAILY FLOW HOME
// The new main screen showing the three-phase daily practice loop
// ═══════════════════════════════════════════════════════════════════════════

interface DailyFlowHomeProps {
  // User info
  name: string;
  totalXp: number;
  currentStreak: number;

  // Today's info
  dayNumber: number;
  totalDays: number;
  worldName: string;

  // Today's lesson
  todaysLesson: FlexibleLesson | null;
  tomorrowsLesson: FlexibleLesson | null;

  // Flow state
  flowState: DailyFlowState;
  exercisesCompleted: number;
  totalExercises: number;

  // Has pending action from GoDoIt
  hasPendingAction: boolean;
  pendingCommitment?: string;

  // Actions
  onStartLesson: () => void;
  onContinueLesson: () => void;
  onStartEcho: () => void;
  onStartExercises: () => void;
  onOpenSettings: () => void;

  // When daily practice is complete, show these
  onBrowseMoreEchoes?: () => void;
  onRedoPastLesson?: () => void;
  onWeeklyReflection?: () => void;
  onOpenDashboard?: () => void;
}

export function DailyFlowHome({
  name,
  totalXp,
  currentStreak,
  dayNumber,
  totalDays,
  worldName,
  todaysLesson,
  tomorrowsLesson,
  flowState,
  exercisesCompleted,
  totalExercises,
  hasPendingAction,
  pendingCommitment,
  onStartLesson,
  onContinueLesson,
  onStartEcho,
  onStartExercises,
  onOpenSettings,
  onBrowseMoreEchoes,
  onRedoPastLesson,
  onWeeklyReflection,
  onOpenDashboard,
}: DailyFlowHomeProps) {
  // Calculate level and progress
  const level = getLevelFromXp(totalXp);
  const xpProgress = getXpProgress(totalXp);

  // World progress percentage
  const worldProgress = Math.round((dayNumber / totalDays) * 100);

  // Is everything complete for today?
  const isComplete = flowState.currentPhase === 'complete';

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Ambient background */}
      <AmbientBackground intensity="normal" particleCount={15} orbCount={3} />

      {/* Main content */}
      <motion.div
        className="relative z-10 flex-1 flex flex-col p-6 max-w-lg mx-auto w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero greeting */}
        <HeroGreeting
          name={name}
          streak={currentStreak}
          onOpenSettings={onOpenSettings}
        />

        {/* Level display */}
        <div className="mb-6">
          <LevelDisplay
            level={level}
            totalXp={totalXp}
            xpProgress={xpProgress}
          />
        </div>

        {/* World progress */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-stone-400 text-sm">
              Day {dayNumber} of {totalDays}
            </span>
            <span className="text-amber-400 text-sm font-medium">{worldName}</span>
          </div>
          <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
              initial={{ width: 0 }}
              animate={{ width: `${worldProgress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {isComplete ? (
            // ══════════════════════════════════════════════════════════════════
            // ALL COMPLETE FOR TODAY
            // ══════════════════════════════════════════════════════════════════
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col"
            >
              {/* Celebration */}
              <Card variant="glow" padding="lg" className="mb-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.5 }}
                  className="text-5xl mb-4"
                >
                  ✨
                </motion.div>
                <h2 className="text-2xl font-bold text-stone-100 mb-2">
                  Today&apos;s Practice Complete
                </h2>
                <p className="text-stone-400">
                  You&apos;ve done the work. Let the wisdom integrate.
                </p>
              </Card>

              {/* Tomorrow's glimpse */}
              {tomorrowsLesson && (
                <Card variant="glass" padding="md" className="mb-6">
                  <p className="text-stone-500 text-xs uppercase tracking-wider mb-2">
                    Tomorrow&apos;s Glimpse
                  </p>
                  <h3 className="text-lg font-semibold text-stone-200 mb-1">
                    {tomorrowsLesson.title}
                  </h3>
                  <p className="text-stone-400 text-sm">
                    {tomorrowsLesson.teaserText || tomorrowsLesson.subtitle || tomorrowsLesson.description}
                  </p>
                </Card>
              )}

              {/* Want to go deeper? */}
              <div className="mt-auto">
                <p className="text-stone-500 text-xs uppercase tracking-wider mb-3">
                  Want to go deeper?
                </p>
                <div className="space-y-2">
                  {onBrowseMoreEchoes && (
                    <button
                      onClick={onBrowseMoreEchoes}
                      className="w-full p-4 rounded-xl bg-stone-900/50 border border-stone-800 text-left hover:border-stone-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                          <Heart size={18} className="text-amber-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-stone-200 font-medium">Browse More Echoes</p>
                          <p className="text-stone-500 text-sm">Connect with fellow travelers</p>
                        </div>
                        <ChevronRight size={18} className="text-stone-600" />
                      </div>
                    </button>
                  )}

                  {onRedoPastLesson && (
                    <button
                      onClick={onRedoPastLesson}
                      className="w-full p-4 rounded-xl bg-stone-900/50 border border-stone-800 text-left hover:border-stone-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <BookOpen size={18} className="text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-stone-200 font-medium">Redo a Past Lesson</p>
                          <p className="text-stone-500 text-sm">Revisit and deepen</p>
                        </div>
                        <ChevronRight size={18} className="text-stone-600" />
                      </div>
                    </button>
                  )}

                  {onOpenDashboard && (
                    <button
                      onClick={onOpenDashboard}
                      className="w-full p-4 rounded-xl bg-stone-900/50 border border-stone-800 text-left hover:border-stone-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                          <Settings size={18} className="text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-stone-200 font-medium">View Dashboard</p>
                          <p className="text-stone-500 text-sm">Progress, stats, and more</p>
                        </div>
                        <ChevronRight size={18} className="text-stone-600" />
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            // ══════════════════════════════════════════════════════════════════
            // THREE PHASES OF DAILY PRACTICE
            // ══════════════════════════════════════════════════════════════════
            <div className="space-y-4">
              {/* PHASE 1: THE LESSON */}
              <PhaseCard
                phase={1}
                title="Today's Lesson"
                subtitle={todaysLesson?.title || 'Loading...'}
                description={todaysLesson?.subtitle}
                icon={<BookOpen size={20} />}
                status={
                  hasPendingAction
                    ? 'pending'
                    : flowState.currentPhase === 'lesson'
                    ? 'current'
                    : 'completed'
                }
                estimatedMinutes={todaysLesson?.estimatedMinutes}
                xpReward={todaysLesson?.xpReward}
                pendingCommitment={pendingCommitment}
                onAction={hasPendingAction ? onContinueLesson : onStartLesson}
                actionLabel={hasPendingAction ? 'Continue Lesson' : 'Begin Lesson'}
              />

              {/* PHASE 2: THE ECHO */}
              <PhaseCard
                phase={2}
                title="The Echo"
                subtitle="Connect with a fellow traveler"
                description="Respond to someone's reflection"
                icon={<Heart size={20} />}
                status={
                  !flowState.canAccessEcho
                    ? 'locked'
                    : flowState.currentPhase === 'echo'
                    ? 'current'
                    : 'completed'
                }
                estimatedMinutes={3}
                xpReward={10}
                onAction={onStartEcho}
                actionLabel="Respond to Reflection"
              />

              {/* PHASE 3: THE PRACTICE */}
              <PhaseCard
                phase={3}
                title="Today's Practice"
                subtitle={`${totalExercises} exercises`}
                description="Embody today's wisdom"
                icon={<Dumbbell size={20} />}
                status={
                  !flowState.canAccessPractice
                    ? 'locked'
                    : flowState.currentPhase === 'practice'
                    ? 'current'
                    : 'completed'
                }
                estimatedMinutes={10}
                xpReward={25}
                progress={exercisesCompleted}
                total={totalExercises}
                onAction={onStartExercises}
                actionLabel={exercisesCompleted > 0 ? 'Continue Practice' : 'Begin Practice'}
              />
            </div>
          )}
        </div>

        {/* Tomorrow teaser (when not complete) */}
        {!isComplete && tomorrowsLesson && (
          <motion.div
            className="mt-6 pt-4 border-t border-stone-800/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-stone-600 text-xs uppercase tracking-wider mb-1">
              Tomorrow&apos;s Glimpse
            </p>
            <p className="text-stone-500 text-sm">
              <span className="text-stone-400">{tomorrowsLesson.title}</span>
              {tomorrowsLesson.teaserText && (
                <span> — {tomorrowsLesson.teaserText.slice(0, 50)}...</span>
              )}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PHASE CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

type PhaseStatus = 'locked' | 'current' | 'completed' | 'pending';

interface PhaseCardProps {
  phase: number;
  title: string;
  subtitle: string;
  description?: string;
  icon: React.ReactNode;
  status: PhaseStatus;
  estimatedMinutes?: number;
  xpReward?: number;
  progress?: number;
  total?: number;
  pendingCommitment?: string;
  onAction: () => void;
  actionLabel: string;
}

function PhaseCard({
  phase,
  title,
  subtitle,
  description,
  icon,
  status,
  estimatedMinutes,
  xpReward,
  progress,
  total,
  pendingCommitment,
  onAction,
  actionLabel,
}: PhaseCardProps) {
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';
  const isCurrent = status === 'current';
  const isPending = status === 'pending';

  const borderColor = isLocked
    ? 'border-stone-800/50'
    : isCompleted
    ? 'border-emerald-500/30'
    : isCurrent || isPending
    ? 'border-amber-500/30'
    : 'border-stone-800';

  const bgColor = isLocked
    ? 'bg-stone-900/30'
    : isCompleted
    ? 'bg-stone-900/50'
    : 'bg-stone-900/70';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: phase * 0.1 }}
    >
      <Card variant="default" padding="none" className={`${bgColor} ${borderColor} overflow-hidden`}>
        <div className="p-5">
          <div className="flex items-start gap-4">
            {/* Icon/Status */}
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isLocked
                  ? 'bg-stone-800/50 text-stone-600'
                  : isCompleted
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-amber-500/20 text-amber-400'
              }`}
            >
              {isLocked ? (
                <Lock size={20} />
              ) : isCompleted ? (
                <CheckCircle size={20} />
              ) : (
                icon
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-stone-500 text-xs uppercase tracking-wider">
                  Phase {phase}
                </span>
                {isCompleted && (
                  <span className="text-emerald-500 text-xs font-medium">Complete</span>
                )}
              </div>

              <h3 className={`font-semibold mb-1 ${isLocked ? 'text-stone-600' : 'text-stone-100'}`}>
                {title}
              </h3>

              <p className={`text-sm ${isLocked ? 'text-stone-700' : 'text-stone-400'}`}>
                {subtitle}
              </p>

              {/* Progress bar for exercises */}
              {progress !== undefined && total !== undefined && !isLocked && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-stone-500 mb-1">
                    <span>{progress}/{total} completed</span>
                    <span>+{xpReward} XP</span>
                  </div>
                  <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(progress / total) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Pending commitment */}
              {isPending && pendingCommitment && (
                <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <p className="text-amber-400 text-xs uppercase tracking-wider mb-1">
                    Your commitment
                  </p>
                  <p className="text-stone-300 text-sm">
                    &ldquo;{pendingCommitment.slice(0, 100)}{pendingCommitment.length > 100 ? '...' : ''}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* Meta info */}
            {!isLocked && !isCompleted && (
              <div className="text-right">
                {estimatedMinutes && (
                  <p className="text-stone-500 text-xs">~{estimatedMinutes}min</p>
                )}
                {xpReward && !progress && (
                  <p className="text-amber-500 text-xs font-medium">+{xpReward} XP</p>
                )}
              </div>
            )}
          </div>

          {/* Action button */}
          {(isCurrent || isPending) && (
            <motion.div
              className="mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                onClick={onAction}
                variant="primary"
                className="w-full"
                glow
              >
                {actionLabel}
                <ChevronRight size={18} className="ml-2" />
              </Button>
            </motion.div>
          )}

          {/* Locked message */}
          {isLocked && (
            <div className="mt-4 text-center">
              <p className="text-stone-600 text-sm">
                Complete previous phase to unlock
              </p>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

export default DailyFlowHome;
