'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CrossOffLine } from './CrossOffLine';
import { useCrossOff } from '@/hooks/useCrossOff';
import { useAudio } from '@/hooks/useAudio';
import { useHaptics } from '@/hooks/useHaptics';
import { ShimmerOverlay, GlowRing, GoldShimmer, LightSweep } from '@/components/effects/GoldShimmer';
import { Confetti } from '@/components/effects/Confetti';
import { useTranslation } from '@/i18n';
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

const CONQUERED_COPY = {
  en: 'CONQUERED',
  fr: 'ACCOMPLI',
  ar: 'تم الإنجاز',
} as const;

export function TaskCard({ task, onComplete, isNew = false }: TaskCardProps) {
  const { locale } = useTranslation();
  const [isCompleting, setIsCompleting] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [showGlow, setShowGlow] = useState(false);
  const [showSweep, setShowSweep] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showImpact, setShowImpact] = useState(false);
  const [isCollapsing, setIsCollapsing] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [cardDimensions, setCardDimensions] = useState({ width: 0, height: 0 });
  const [stampLanded, setStampLanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
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

  const spawnParticles = useCallback(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 28; i++) {
      const angle = (Math.PI * 2 * i) / 28 + (Math.random() - 0.5) * 0.5;
      const speed = 100 + Math.random() * 80;
      newParticles.push({
        id: Date.now() + i,
        x: 50,
        y: 50,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
        size: 6 + Math.random() * 10,
        rotation: Math.random() * 360,
      });
    }
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 1000);
  }, []);

  const handleComplete = useCallback(() => {
    if (isCompleting) return;

    // === PHASE 1: IMPACT (0ms) — Immediate visceral hit ===
    setShowFlash(true);
    setShowImpact(true);
    audio.playUI('celebrate');
    hapticCelebration();

    // === PHASE 2: WEIGHT (100ms) — Let the moment breathe ===
    setTimeout(() => {
      setShowFlash(false);
      setShowGlow(true);
      setShowSweep(true);
      setShowConfetti(true);
      audio.playUI('chime');
      customHaptic([30, 40, 50, 30, 70]);
    }, 100);

    // === PHASE 3: ERUPTION (250ms) — Particle burst + second sound layer ===
    setTimeout(() => {
      spawnParticles();
      audio.playUI('pop');
    }, 250);

    // === PHASE 4: GLORY HOLD (500ms) — Let them SEE what they did ===
    setTimeout(() => {
      setShowImpact(false);
      setShowSweep(false);
    }, 800);

    // === PHASE 5: GRACEFUL COLLAPSE (1200ms) — Dramatic weighted fall ===
    setTimeout(() => {
      setIsCompleting(true);
      setIsCollapsing(true);
    }, 1200);

    // === PHASE 6: SIGNAL PARENT (2000ms) — After full animation ===
    setTimeout(() => onComplete(task.id), 2000);
  }, [isCompleting, audio, hapticCelebration, customHaptic, spawnParticles, onComplete, task.id]);

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
        opacity: isCollapsing ? 0 : 1,
        scale: isCollapsing ? 0.3 : 1,
        height: isCollapsing ? 0 : 'auto',
        marginBottom: isCollapsing ? 0 : 12,
        y: isCollapsing ? -20 : 0,
        filter: isCollapsing ? 'blur(8px)' : 'blur(0px)',
      }}
      transition={
        isNew
          ? { type: 'spring', stiffness: 800, damping: 12, mass: 0.8 }
          : isCollapsing
            ? { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
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

        {/* Cross-off line overlay — stays visible through completion celebration */}
        {cardDimensions.width > 0 && !isCollapsing && (
          <CrossOffLine
            startPoint={crossOff.startPoint}
            currentPoint={crossOff.currentPoint}
            points={crossOff.points}
            isActive={crossOff.isActive}
            isComplete={crossOff.isComplete}
            progress={crossOff.progress}
            cardWidth={cardDimensions.width}
            cardHeight={cardDimensions.height}
          />
        )}

        {/* Flash overlay — immediate white-gold burst */}
        <AnimatePresence>
          {showFlash && (
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.6, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                zIndex: 20,
                background: 'radial-gradient(circle at center, rgba(255,255,255,0.9) 0%, rgba(251,191,36,0.7) 40%, rgba(245,158,11,0.3) 70%, transparent 100%)',
              }}
            />
          )}
        </AnimatePresence>

        {/* Impact shockwave — expanding ring on completion */}
        <AnimatePresence>
          {showImpact && (
            <>
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                initial={{ opacity: 0.8, scale: 1 }}
                animate={{ opacity: 0, scale: 1.6 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                style={{
                  zIndex: 21,
                  border: '3px solid rgba(251,191,36,0.6)',
                  borderRadius: '16px',
                }}
              />
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                initial={{ opacity: 0.5, scale: 1 }}
                animate={{ opacity: 0, scale: 2 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
                style={{
                  zIndex: 21,
                  border: '2px solid rgba(251,191,36,0.3)',
                  borderRadius: '16px',
                }}
              />
            </>
          )}
        </AnimatePresence>

        {/* Completion text stamp — "DONE" that appears briefly */}
        <AnimatePresence>
          {showImpact && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0, scale: 0.3, rotate: -15 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.3, 1.1, 1, 0.95], rotate: [-15, 3, 0, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              style={{ zIndex: 25 }}
            >
              <span className="text-3xl font-black text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.8)] tracking-widest">
                {CONQUERED_COPY[locale] ?? CONQUERED_COPY.en}
              </span>
            </motion.div>
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
                opacity: [1, 1, 0.8, 0],
                scale: [0.3, 1.8, 1.2, 0],
                rotate: p.rotation + 720,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
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

      {/* LightSweep on completion — golden sweep across the card */}
      <LightSweep active={showSweep} color="#fbbf24" duration={0.8} />

      {/* GlowRing on completion — expanding golden rings */}
      <GlowRing active={showGlow} rings={4} color="#fbbf24" />

      {/* GoldShimmer on completion — rising golden particles */}
      <GoldShimmer active={showGlow} variant="gold" intensity="intense" duration={2000} />

      {/* Confetti burst on completion */}
      <Confetti active={showConfetti} particleCount={30} duration={2000} />
    </motion.div>
  );
}
