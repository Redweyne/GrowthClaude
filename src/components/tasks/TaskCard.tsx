'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CrossOffLine } from './CrossOffLine';
import { useCrossOff } from '@/hooks/useCrossOff';
import { useAudio } from '@/hooks/useAudio';
import { useHaptics } from '@/hooks/useHaptics';
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
];

export function TaskCard({ task, onComplete, isNew = false }: TaskCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [cardDimensions, setCardDimensions] = useState({ width: 0, height: 0 });
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
    for (let i = 0; i < 14; i++) {
      const angle = (Math.PI * 2 * i) / 14 + (Math.random() - 0.5) * 0.4;
      newParticles.push({
        id: Date.now() + i,
        x: 50,
        y: 50,
        vx: Math.cos(angle) * (70 + Math.random() * 50),
        vy: Math.sin(angle) * (70 + Math.random() * 50),
        color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
        size: 4 + Math.random() * 7,
        rotation: Math.random() * 360,
      });
    }
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 750);
  }, []);

  const handleComplete = useCallback(() => {
    if (isCompleting) return;
    setIsCompleting(true);

    // Flash
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 250);

    // Sound + haptic
    audio.playUI('celebrate');
    hapticCelebration();

    // Confetti burst
    setTimeout(() => spawnParticles(), 100);

    // Signal parent after collapse animation
    setTimeout(() => onComplete(task.id), 600);
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
      initial={isNew ? { opacity: 0, scale: 1.2, y: -30 } : { opacity: 1 }}
      animate={{
        opacity: isCompleting ? 0 : 1,
        scale: isCompleting ? 0.85 : 1,
        height: isCompleting ? 0 : 'auto',
        marginBottom: isCompleting ? 0 : 12,
        y: 0,
      }}
      transition={
        isNew
          ? { type: 'spring', stiffness: 600, damping: 15, mass: 0.8 }
          : isCompleting
            ? { duration: 0.4, ease: [0.4, 0, 0.2, 1], delay: 0.2 }
            : { type: 'spring', stiffness: 400, damping: 25 }
      }
      onAnimationComplete={() => {
        if (isNew) {
          audio.playUI('pop');
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
        {/* Content layer */}
        <div
          className={`relative p-4 rounded-2xl border transition-all duration-200 ${
            crossOff.isActive
              ? 'bg-stone-900/90 border-amber-500/30 shadow-[0_0_25px_rgba(251,191,36,0.25)]'
              : 'bg-stone-900/80 border-stone-700/50 light:bg-stone-100/80 light:border-stone-300/50'
          }`}
        >
          {/* Idle ambient shimmer */}
          {!crossOff.isActive && !isCompleting && (
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              animate={{
                boxShadow: [
                  '0 0 0px rgba(251,191,36,0)',
                  '0 0 8px rgba(251,191,36,0.08)',
                  '0 0 0px rgba(251,191,36,0)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}

          {/* Activation scale */}
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

        {/* Flash overlay on completion */}
        <AnimatePresence>
          {showFlash && (
            <motion.div
              className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400/60 to-yellow-300/60 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.7, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
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
              initial={{ opacity: 1, scale: 0.5, rotate: 0 }}
              animate={{
                x: p.vx,
                y: p.vy,
                opacity: [1, 1, 0],
                scale: [0.5, 1.3, 0.2],
                rotate: p.rotation + 400,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
            />
          ))}
        </AnimatePresence>

        {/* Stamp ripple on new card */}
        {isNew && (
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-amber-400/60 pointer-events-none"
            initial={{ opacity: 0.9, scale: 0.95 }}
            animate={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{ zIndex: 5 }}
          />
        )}
      </div>
    </motion.div>
  );
}
