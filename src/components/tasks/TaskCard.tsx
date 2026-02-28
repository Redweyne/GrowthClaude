'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScratchCanvas } from './ScratchCanvas';
import { useAudio } from '@/hooks/useAudio';
import { useHaptics } from '@/hooks/useHaptics';
import { useTasksStore, type DailyTask } from '@/store/useTasksStore';

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
  '#fbbf24', // amber-400
  '#f59e0b', // amber-500
  '#d97706', // amber-600
  '#34d399', // emerald-400
  '#fcd34d', // amber-300
  '#fde68a', // amber-200
];

export function TaskCard({ task, onComplete, isNew = false }: TaskCardProps) {
  const [scratchProgress, setScratchProgress] = useState(task.scratchProgress);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [cardDimensions, setCardDimensions] = useState({ width: 0, height: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const { updateScratchProgress } = useTasksStore();
  const audio = useAudio();
  const { haptic, hapticCelebration, customHaptic } = useHaptics();

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

  const handleProgress = useCallback((coverage: number) => {
    setScratchProgress(coverage);
    updateScratchProgress(task.id, coverage);
    if (!isActive) setIsActive(true);
  }, [task.id, updateScratchProgress, isActive]);

  const spawnParticles = useCallback(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI * 2 * i) / 10 + Math.random() * 0.5;
      newParticles.push({
        id: Date.now() + i,
        x: 50,
        y: 50,
        vx: Math.cos(angle) * (60 + Math.random() * 40),
        vy: Math.sin(angle) * (60 + Math.random() * 40),
        color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
        size: 4 + Math.random() * 6,
        rotation: Math.random() * 360,
      });
    }
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 700);
  }, []);

  const handleComplete = useCallback(() => {
    if (isCompleting) return;
    setIsCompleting(true);
    setIsActive(false);

    // Flash
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 200);

    // Sound + haptic
    audio.playSuccess();
    hapticCelebration();

    // Confetti burst
    spawnParticles();

    // Collapse after flash
    setTimeout(() => {
      onComplete(task.id);
    }, 500);
  }, [isCompleting, audio, hapticCelebration, spawnParticles, onComplete, task.id]);

  if (task.completedAt) return null;

  return (
    <motion.div
      layout
      initial={isNew ? { opacity: 0, scale: 1.15, y: -20 } : { opacity: 1 }}
      animate={{
        opacity: isCompleting ? 0 : 1,
        scale: isCompleting ? 0.8 : 1,
        height: isCompleting ? 0 : 'auto',
        marginBottom: isCompleting ? 0 : 12,
        y: 0,
      }}
      transition={
        isNew
          ? { type: 'spring', stiffness: 600, damping: 15, mass: 0.8 }
          : isCompleting
            ? { duration: 0.35, ease: [0.4, 0, 0.2, 1], delay: 0.15 }
            : { type: 'spring', stiffness: 400, damping: 25 }
      }
      onAnimationComplete={() => {
        // Fire stamp sound + haptic when new card lands
        if (isNew) {
          audio.playUI('pop');
          haptic('taskStamp');
        }
      }}
      className="overflow-hidden"
    >
      <div
        ref={cardRef}
        className={`relative rounded-2xl overflow-hidden transition-shadow duration-300 ${
          isActive
            ? 'shadow-[0_0_20px_rgba(251,191,36,0.2)]'
            : 'shadow-lg'
        }`}
      >
        {/* Content layer (underneath) */}
        <div className="relative p-4 bg-stone-900/80 light:bg-stone-100/80 border border-stone-700/50 light:border-stone-300/50 rounded-2xl">
          <p className="text-base text-amber-100 light:text-stone-800 font-medium leading-relaxed select-none">
            {task.text}
          </p>

          {/* Progress bar */}
          <div className="mt-3 h-1 rounded-full bg-stone-800 light:bg-stone-200 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: scratchProgress / 100 }}
              style={{ transformOrigin: 'left' }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>

        {/* Scratch canvas overlay */}
        {cardDimensions.width > 0 && cardDimensions.height > 0 && !isCompleting && (
          <ScratchCanvas
            width={cardDimensions.width}
            height={cardDimensions.height}
            onProgress={handleProgress}
            onComplete={handleComplete}
            enabled={!isCompleting}
            initialProgress={task.scratchProgress}
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
              transition={{ duration: 0.2 }}
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
              }}
              initial={{ opacity: 1, scale: 0.5, rotate: 0 }}
              animate={{
                x: p.vx,
                y: p.vy,
                opacity: [1, 1, 0],
                scale: [0.5, 1.2, 0.3],
                rotate: p.rotation + 360,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          ))}
        </AnimatePresence>

        {/* Stamp ripple on new card */}
        {isNew && (
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-amber-400/50 pointer-events-none"
            initial={{ opacity: 0.8, scale: 0.95 }}
            animate={{ opacity: 0, scale: 1.15 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          />
        )}
      </div>
    </motion.div>
  );
}
