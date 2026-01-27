'use client';

// ═══════════════════════════════════════════════════════════════════════════
// GOAL STEP - THE VISION
// ═══════════════════════════════════════════════════════════════════════════
//
// This is not a goal selector. This is seeing your future self.
// Each choice represents a path of transformation.
// The cards should feel sacred - each one holding a different destiny.
//
// When selected, the card blooms with light. The meaning deepens.
// The question is: who do you want to become?
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, Compass } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { TRANSFORMATION_GOALS, type TransformationGoal } from '@/types';
import { Button } from '@/components/ui';
import { useTranslation } from '@/i18n';

interface GoalStepProps {
  onNext: () => void;
  onBack: () => void;
}

// Spring configurations
const springs = {
  gentle: { type: 'spring' as const, stiffness: 120, damping: 14 },
  bouncy: { type: 'spring' as const, stiffness: 500, damping: 15 },
};

// Colors and glow for each goal (descriptions are translated in component)
const GOAL_DEPTHS: Record<string, { color: string; glow: string }> = {
  calmer: {
    color: '#22d3ee',
    glow: 'rgba(34, 211, 238, 0.3)',
  },
  disciplined: {
    color: '#f97316',
    glow: 'rgba(249, 115, 22, 0.3)',
  },
  confident: {
    color: '#fbbf24',
    glow: 'rgba(251, 191, 36, 0.3)',
  },
  leader: {
    color: '#a78bfa',
    glow: 'rgba(167, 139, 250, 0.3)',
  },
  focused: {
    color: '#3b82f6',
    glow: 'rgba(59, 130, 246, 0.3)',
  },
  resilient: {
    color: '#ef4444',
    glow: 'rgba(239, 68, 68, 0.3)',
  },
};

export function GoalStep({ onNext, onBack }: GoalStepProps) {
  const { name, transformationGoal, setTransformationGoal } = useStore();
  const [mounted, setMounted] = useState(false);
  const { t, isRTL } = useTranslation();

  // Get translated description for a goal
  const getGoalDescription = (goalId: string): string => {
    return t(`onboarding.goal.goals.${goalId}.description` as any);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelectGoal = (goal: TransformationGoal) => {
    setTransformationGoal(goal);
  };

  const handleContinue = () => {
    if (transformationGoal) {
      onNext();
    }
  };

  const selectedGoalData = TRANSFORMATION_GOALS.find((g) => g.id === transformationGoal);
  const selectedDepth = transformationGoal ? GOAL_DEPTHS[transformationGoal] : null;

  if (!mounted) {
    return <div className="min-h-[70vh]" />;
  }

  return (
    <div className="min-h-[70vh] flex flex-col">
      {/* Back button */}
      <motion.button
        onClick={onBack}
        initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className={`flex items-center text-stone-500 hover:text-stone-300 transition-colors mb-6 group ${isRTL ? 'self-end flex-row-reverse' : 'self-start'}`}
      >
        <ChevronLeft size={20} className={`transition-transform ${isRTL ? 'rotate-180 group-hover:translate-x-1' : 'group-hover:-translate-x-1'}`} />
        <span className="text-sm">{t('common.back')}</span>
      </motion.button>

      {/* The question - personalized */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, ...springs.gentle }}
          className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-purple-500/20 to-stone-900 border border-purple-500/20 flex items-center justify-center"
        >
          <Compass size={26} className="text-purple-400" />
        </motion.div>

        <p className="text-2xl sm:text-3xl text-amber-100 font-light mb-2">
          {name ? `${name}, ` : ''}{t('onboarding.goal.whoDoYouWant')}
        </p>
        <p className="text-stone-500">{t('onboarding.goal.chooseTransformation')}</p>
      </motion.div>

      {/* Goal options - beautiful cards with depth */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {TRANSFORMATION_GOALS.map((goal, index) => {
          const depth = GOAL_DEPTHS[goal.id];
          const isSelected = transformationGoal === goal.id;

          return (
            <motion.button
              key={goal.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05, ...springs.gentle }}
              onClick={() => handleSelectGoal(goal.id)}
              className="relative p-4 rounded-2xl text-left transition-all duration-300 overflow-hidden group"
              style={{
                background: isSelected
                  ? `linear-gradient(135deg, ${depth.color}15 0%, rgba(12, 10, 9, 0.9) 100%)`
                  : 'rgba(28, 25, 23, 0.6)',
                border: isSelected
                  ? `2px solid ${depth.color}50`
                  : '2px solid rgba(68, 64, 60, 0.5)',
                boxShadow: isSelected ? `0 0 30px ${depth.glow}` : 'none',
              }}
              whileHover={{
                scale: 1.02,
                borderColor: isSelected ? `${depth.color}70` : 'rgba(168, 162, 158, 0.3)',
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Background glow on hover */}
              <motion.div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle at center, ${depth.glow} 0%, transparent 70%)`,
                }}
              />

              {/* Icon */}
              <motion.div
                className="text-3xl mb-2 relative z-10"
                animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {goal.icon}
              </motion.div>

              {/* Title */}
              <h3
                className="font-medium text-sm relative z-10 transition-colors"
                style={{
                  color: isSelected ? depth.color : '#d6d3d1',
                }}
              >
                {goal.title}
              </h3>

              {/* Selected indicator */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={springs.bouncy}
                    className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: depth.color }}
                  >
                    <Check size={14} className="text-stone-950" strokeWidth={3} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Shimmer effect on selected */}
              {isSelected && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  animate={{
                    background: [
                      `linear-gradient(90deg, transparent 0%, ${depth.color}10 50%, transparent 100%)`,
                      `linear-gradient(90deg, transparent 0%, ${depth.color}10 50%, transparent 100%)`,
                    ],
                    backgroundPosition: ['-100% 0', '200% 0'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  style={{ backgroundSize: '50% 100%' }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Depth reveal - shows deeper meaning when selected */}
      <AnimatePresence mode="wait">
        {transformationGoal && selectedGoalData && selectedDepth && (
          <motion.div
            key={transformationGoal}
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6 overflow-hidden"
          >
            <div
              className="text-center py-6 px-5 rounded-2xl border"
              style={{
                background: `linear-gradient(135deg, ${selectedDepth.color}08 0%, rgba(12, 10, 9, 0.8) 100%)`,
                borderColor: `${selectedDepth.color}20`,
              }}
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg font-light mb-2"
                style={{ color: selectedDepth.color }}
              >
                {selectedGoalData.title}
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-stone-400 text-sm leading-relaxed italic"
              >
                &ldquo;{getGoalDescription(transformationGoal)}&rdquo;
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer to push button down */}
      <div className="flex-1" />

      {/* Continue button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Button
          size="lg"
          onClick={handleContinue}
          disabled={!transformationGoal}
          glow={!!transformationGoal}
          className={`w-full group ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          {transformationGoal ? (
            <>
              {t('onboarding.goal.thisIsMyPath')}
              <ChevronRight
                size={18}
                className={`opacity-60 group-hover:opacity-100 transition-all ${isRTL ? 'mr-2 rotate-180 group-hover:-translate-x-1' : 'ml-2 group-hover:translate-x-1'}`}
              />
            </>
          ) : (
            t('onboarding.goal.chooseYour')
          )}
        </Button>
      </motion.div>
    </div>
  );
}

export default GoalStep;
