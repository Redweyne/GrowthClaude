'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CrossOffLine } from './CrossOffLine';
import { useCrossOff } from '@/hooks/useCrossOff';
import { useAudio } from '@/hooks/useAudio';
import { useHaptics } from '@/hooks/useHaptics';
import { ShimmerOverlay, GlowRing, GoldShimmer } from '@/components/effects/GoldShimmer';
import type { DailyTask } from '@/store/useTasksStore';

interface TaskCardProps {
  task: DailyTask;
  onComplete: (taskId: string) => void;
  isNew?: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
}

const PARTICLE_COLORS = [
  '#fbbf24', '#f59e0b', '#d97706',
  '#34d399', '#fcd34d', '#fde68a',
  '#a78bfa', '#fb7185',
];

export function TaskCard({ task, onComplete, isNew = false }: TaskCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [showGlow, setShowGlow] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [cardDimensions, setCardDimensions] = useState({ width: 0, height: 0 });
  const [stampLanded, setStampLanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const audio = useAudio();
  const { haptic, hapticCelebration } = useHaptics();

  // Measure card dimensions
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setCardDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  const spawnParticles = useCallback(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 20; i++) {
      const angle = (Math.PI * 2 * i) / 20 + (Math.random() - 0.5) * 0.4;
      newParticles.push({
        id: Date.now() + i,
        x: 50,
        y: 50,
        vx: Math.cos(angle) * (80 + Math.random() * 60),
        vy: Math.sin(angle) * (80 + Math.random() * 60),
        color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
        size: 5 + Math.random() * 8,
        rotation: Math.random() * 360,
      });
    }
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 800);
  }, []);

  const handleComplete = useCallback(() => {
    if (isCompleting) return;
    setIsCompleting(true);

    // Flash
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 300);

    // GlowRing + GoldShimmer
    setShowGlow(true);

    // Layered sounds: celebrate + chime
    audio.playUI('celebrate');
    setTimeout(() => audio.playUI('chime'), 200);
    hapticCelebration();

    // Confetti burst
    setTimeout(() => spawnParticles(), 80);

    // Signal parent after animations
    setTimeout(() => onComplete(task.id), 700);
  }, [isCompleting, audio, hapticCelebration, spawnParticles, onComplete, task.id]);

  // Cross-off hook
  const crossOff = useCrossOff({
    cardRef,
    onComplete: handleComplete,
    enabled: !isCompleting && !task.completedAt,
    completionThreshold: 80,
  });

  if (task.completedAt) return null;

  return (
    <motion.div
      layout
      initial={isNew ? { opacity: 0, scale: 1.25, y: -35 } : { opacity: 1 }}
      animate={{
        opacity: isCompleting ? 0 : 1,
        scale: isCompleting ? 0.8 : 1,
        height: isCompleting ? 0 : 'auto',
        marginBottom: isCompleting ? 0 : 12,
        y: 0,
      }}
      transition={
        isNew
          ? { type: 'spring', stiffness: 800, damping: 12, mass: 0.8 }
          : isCompleting
            ? { duration: 0.4, ease: [0.4, 0, 0.2, 1], delay: 0.2 }
            : { type: 'spring', stiffness: 400, damping: 25 }
      }
      onAnimationComplete={() => {
        if (isNew && !stampLanded) {
          setStampLanded(true);
          // Layered stamp sounds
          audio.playUI('pop');
          audio.playUI('whoosh');
          haptic('taskStamp');
        }
      }}
      className="overflow-hidden"
    >
      <div
        ref={cardRef}
        className="relative rounded-2xl overflow-hidden touch-none"
        style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
      >
        {/* Card content with shake on active cross-off */}
        <div
          className={`relative p-4 rounded-2xl border transition-all duration-200 ${
            crossOff.isActive
              ? 'bg-stone-900/95 border-amber-500/40 shadow-[0_0_30px_rgba(251,191,36,0.3)] animate-[shake_0.08s_linear_infinite]'
              : 'bg-stone-900/80 border-stone-700/50 light:bg-stone-100/80 light:border-stone-300/50'
          }`}
        >
          {/* Shimmer overlay on idle cards — premium light sweep */}
          {!crossOff.isActive && !isCompleting && (
            <ShimmerOverlay active={true} className="rounded-2xl" />
          )}

          {/* Idle ambient glow — subtle golden pulse */}
          {!crossOff.isActive && !isCompleting && (
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              animate={{
                boxShadow: [
                  '0 0 0px rgba(251,191,36,0)',
                  '0 0 12px rgba(251,191,36,0.1)',
                  '0 0 0px rgba(251,191,36,0)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}

          {/* Task text with activation scale */}
          <motion.div
            animate={{ scale: crossOff.isActive ? 1.02 : 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <p className="text-base text-amber-100 light:text-stone-800 font-medium leading-relaxed select-none">
              {task.text}
            </p>
          </motion.div>
        </div>

        {/* Cross-off line overlay */}
        {cardDimensions.width > 0 && !isCompleting && (
          <CrossOffLine
            startPoint={crossOff.startPoint}
            currentPoint={crossOff.currentPoint}
            isActive={crossOff.isActive}
            isComplete={crossOff.isComplete}
            progress={crossOff.progress}
            cardWidth={cardDimensions.width}
            cardHeight={cardDimensions.height}
          />
        )}

        {/* Flash overlay */}
        <AnimatePresence>
          {showFlash && (
            <motion.div
              className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400/70 to-yellow-300/70 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ zIndex: 20 }}
            />
          )}
        </AnimatePresence>

        {/* Confetti particles */}
        <AnimatePresence>
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute pointer-events-none"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                backgroundColor: p.color,
                zIndex: 30,
              }}
              initial={{ opacity: 1, scale: 0.3, rotate: 0 }}
              animate={{
                x: p.vx,
                y: p.vy,
                opacity: [1, 1, 0],
                scale: [0.3, 1.4, 0.1],
                rotate: p.rotation + 500,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          ))}
        </AnimatePresence>

        {/* Stamp ripple + flash on new card */}
        {isNew && (
          <>
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-amber-400/70 pointer-events-none"
              initial={{ opacity: 0.9, scale: 0.95 }}
              animate={{ opacity: 0, scale: 1.25 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              style={{ zIndex: 5 }}
            />
            {/* Stamp impact flash */}
            <motion.div
              className="absolute inset-0 rounded-2xl bg-amber-400/20 pointer-events-none"
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              style={{ zIndex: 4 }}
            />
          </>
        )}
      </div>

      {/* GlowRing on completion — expanding golden rings */}
      <GlowRing active={showGlow} rings={3} color="#fbbf24" />

      {/* GoldShimmer on completion — rising golden particles */}
      <GoldShimmer active={showGlow} variant="gold" intensity="intense" duration={1500} />
    </motion.div>
  );
}
