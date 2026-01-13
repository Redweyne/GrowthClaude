'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { useSound } from '@/hooks/useSound';
import { Confetti } from '@/components/effects/Confetti';
import { AchievementUnlockAnimation } from './AchievementBadge';
import { getAchievementById } from '@/types/achievements';

export function AchievementCelebration() {
  const {
    getPendingCelebration,
    clearPendingCelebration,
    markAchievementCelebrated,
  } = useStore();
  const { playCelebration } = useSound();

  const [showCelebration, setShowCelebration] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<ReturnType<typeof getAchievementById>>(undefined);
  const [showConfetti, setShowConfetti] = useState(false);

  const pendingId = getPendingCelebration();

  useEffect(() => {
    if (pendingId) {
      const achievement = getAchievementById(pendingId);
      if (achievement) {
        setCurrentAchievement(achievement);
        setShowCelebration(true);
        setShowConfetti(true);
        playCelebration();
      }
    }
  }, [pendingId, playCelebration]);

  const handleComplete = () => {
    if (pendingId) {
      markAchievementCelebrated(pendingId);
      clearPendingCelebration();
    }
    setShowCelebration(false);
    setCurrentAchievement(undefined);
  };

  return (
    <>
      {/* Confetti effect */}
      <Confetti
        active={showConfetti}
        duration={3000}
        particleCount={100}
        onComplete={() => setShowConfetti(false)}
      />

      {/* Achievement unlock animation */}
      <AnimatePresence>
        {showCelebration && currentAchievement && (
          <AchievementUnlockAnimation
            achievement={currentAchievement}
            onComplete={handleComplete}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default AchievementCelebration;
