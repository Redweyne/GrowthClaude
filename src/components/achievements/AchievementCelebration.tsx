'use client';

// ============================================================================
// MILESTONE CELEBRATION - A Moment to Honor the Journey
// ============================================================================
//
// When a milestone is reached, we don't just flash a notification.
// We create a moment of genuine acknowledgment.
//
// This is the pause that says: "What you just did matters."
// ============================================================================

import { useEffect, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { useAudio } from '@/hooks/useAudio';
import { Confetti } from '@/components/effects/Confetti';
import { MilestoneUnlockAnimation } from './AchievementBadge';
import { getMilestoneById, type Milestone } from '@/types/achievements';

// ============================================================================
// MILESTONE CELEBRATION COMPONENT
// ============================================================================

export function MilestoneCelebration() {
  const {
    getPendingCelebration,
    clearPendingCelebration,
    markAchievementCelebrated,
  } = useStore();
  const { playCelebrate, playLevelUp, playUnlock } = useAudio();

  const [showCelebration, setShowCelebration] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState<Milestone | undefined>(undefined);
  const [showConfetti, setShowConfetti] = useState(false);

  const pendingId = getPendingCelebration();

  // When a milestone is ready to be celebrated
  useEffect(() => {
    if (pendingId) {
      const milestone = getMilestoneById(pendingId);
      if (milestone) {
        setCurrentMilestone(milestone);
        setShowCelebration(true);

        // Confetti only for significant milestones (cornerstone and above)
        const significantWeight = ['cornerstone', 'monument', 'legacy'];
        if (significantWeight.includes(milestone.weight)) {
          setShowConfetti(true);
          playLevelUp();
        } else {
          playUnlock();
        }
        // Always play celebrate sound for achievements
        playCelebrate();
      }
    }
  }, [pendingId, playCelebrate, playLevelUp, playUnlock]);

  // Handle completion of the celebration
  const handleComplete = useCallback(() => {
    if (pendingId) {
      markAchievementCelebrated(pendingId);
      clearPendingCelebration();
    }
    setShowCelebration(false);
    setCurrentMilestone(undefined);
  }, [pendingId, markAchievementCelebrated, clearPendingCelebration]);

  return (
    <>
      {/* Confetti for significant milestones */}
      <Confetti
        active={showConfetti}
        duration={4000}
        particleCount={80}
        onComplete={() => setShowConfetti(false)}
      />

      {/* The milestone acknowledgment */}
      <AnimatePresence>
        {showCelebration && currentMilestone && (
          <MilestoneUnlockAnimation
            milestone={currentMilestone}
            onComplete={handleComplete}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// Legacy alias
export function AchievementCelebration() {
  return <MilestoneCelebration />;
}

export default MilestoneCelebration;
